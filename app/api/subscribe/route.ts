import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MJ_LIST_ID = process.env.MJ_LIST_ID;
// Opt-in-only monthly newsletter list (not a secret - just a list id; safe to default).
const MJ_NEWSLETTER_LIST_ID = process.env.MJ_NEWSLETTER_LIST_ID || "10625984";
const MJ_KEY = process.env.MJ_API_KEY;
const MJ_SECRET = process.env.MJ_SECRET_KEY;

// In-memory rate limiter: { ip: [timestamps] }
const recent = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
// Higher cap so legitimate users behind shared NAT (offices, mobile carriers) aren't 429'd during the launch blast.
const MAX_PER_IP = 25;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_IP) return true;
  arr.push(now);
  recent.set(ip, arr);
  // GC: clear old entries occasionally
  if (recent.size > 5000) {
    for (const [k, ts] of recent.entries()) {
      const fresh = ts.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) recent.delete(k);
      else recent.set(k, fresh);
    }
  }
  return false;
}

// Process-global welcome-send cap. The per-IP limiter keys on cf-connecting-ip,
// which is forgeable when the origin is hit directly (bypassing Cloudflare), so
// IP/header rotation can defeat it. This global cap is the one backstop rotation
// cannot multiply: an attacker cannot fire more than N attacker-addressed welcome
// emails per window no matter how many fake IPs they use. Generous vs real organic
// signup volume (the 10,830 blast goes via Mailjet campaign, not this endpoint).
let welcomeWindowStart = Date.now();
let welcomeCount = 0;
const WELCOME_WINDOW_MS = 60 * 60 * 1000;
const MAX_WELCOME_PER_WINDOW = 300;
function welcomeAllowed(): boolean {
  const now = Date.now();
  if (now - welcomeWindowStart > WELCOME_WINDOW_MS) {
    welcomeWindowStart = now;
    welcomeCount = 0;
  }
  if (welcomeCount >= MAX_WELCOME_PER_WINDOW) return false;
  welcomeCount++;
  return true;
}

export async function POST(req: NextRequest) {
  if (!MJ_KEY || !MJ_SECRET || !MJ_LIST_ID) {
    return NextResponse.json({ error: "Mail service not configured" }, { status: 500 });
  }

  let body: {
    email?: string;
    zip?: string;
    source?: string;
    website?: string;
    ts?: number;
    newsletter?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill 'website' field which humans never see
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true }); // silent OK to confuse bots
  }

  // Time gate: must take >2s to fill form (bots submit instantly).
  // Use abs() so a client with a skewed/future clock isn't silently rejected.
  if (body.ts && Math.abs(Date.now() - body.ts) < 2000) {
    return NextResponse.json({ ok: true });
  }

  // Rate limit per IP
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many subscriptions from this address. Try again later." },
      { status: 429 },
    );
  }

  const email = (body.email || "").trim().toLowerCase();
  const zip = (body.zip || "").trim().slice(0, 10);
  const source = (body.source || "unknown").slice(0, 64);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const auth = Buffer.from(`${MJ_KEY}:${MJ_SECRET}`).toString("base64");

  // Is this a brand-new contact? managecontact (addnoforce) is idempotent and 2xx's for
  // existing contacts, so without this check the welcome email re-fires on every resubmit.
  let isNewContact = true;
  try {
    const existing = await fetch(
      `https://api.mailjet.com/v3/REST/contact/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    if (existing.ok) {
      const j = await existing.json();
      isNewContact = !(j?.Count > 0);
    } // 404 => new contact => isNewContact stays true
  } catch {
    // network blip on the lookup: fall through and treat as new (welcome may resend, acceptable)
  }

  try {
    const res = await fetch(
      `https://api.mailjet.com/v3/REST/contactslist/${MJ_LIST_ID}/managecontact`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Action: "addnoforce",
          Properties: {
            zip: zip || "",
            source,
          },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      if (text.includes("MJ18") || text.includes("already")) {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      console.error("Mailjet error", res.status, text);
      return NextResponse.json({ error: "Subscribe failed, try again" }, { status: 502 });
    }

    // Optional second list: monthly newsletter, explicit opt-in only. Failure here
    // must not fail the core subscribe (they are already on the rate-alert list).
    if (body.newsletter === true) {
      try {
        await fetch(
          `https://api.mailjet.com/v3/REST/contactslist/${MJ_NEWSLETTER_LIST_ID}/managecontact`,
          {
            method: "POST",
            headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              Email: email,
              Action: "addnoforce",
              Properties: { zip: zip || "", source },
            }),
          },
        );
      } catch (e) {
        console.error("Newsletter list add failed", e);
      }
    }

    // Fire-and-forget welcome email (NEW contact only, under the global send cap).
    if (isNewContact && welcomeAllowed()) {
      sendWelcomeEmail(email, auth, body.newsletter === true).catch((err) => {
        console.error("Welcome email send failed", err);
      });
    }

    return NextResponse.json({ ok: true, alreadySubscribed: !isNewContact });
  } catch (e) {
    console.error("Subscribe fetch error", e);
    return NextResponse.json({ error: "Network error" }, { status: 503 });
  }
}

async function sendWelcomeEmail(email: string, auth: string, optedNewsletter: boolean): Promise<void> {
  const subject = optedNewsletter
    ? "You're in - launch alert + the newsletter"
    : "You're in - we'll email you when the pay stub generator launches";
  const intro = optedNewsletter
    ? "You're in. We'll email you when the pay stub generator launches, plus the PayDocHub newsletter you opted into - new employer guides and tips. Unsubscribe from either any time."
    : "You're in. We'll email you when the pay stub generator launches, and as new tools ship. No daily newsletter, no funnel.";
  const text = [
    "Thanks for joining PayDocHub.",
    "",
    intro,
    "",
    "While you wait, find your employer:",
    "- All employers: https://paydochub.com/companies",
    "- Create a pay stub: https://paydochub.com/paystub-maker",
    "",
    "You subscribed at paydochub.com.",
    "Unsubscribe any time: email hello@paydochub.com with subject 'unsubscribe'.",
  ].join("\n");

  const html = welcomeHtml(intro);

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: "hello@paydochub.com", Name: "PayDocHub" },
          To: [{ Email: email }],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
          Headers: {
            // mailto-only: no /unsubscribe one-click endpoint exists yet, so we do NOT
            // advertise List-Unsubscribe-Post (which requires a working HTTPS POST URL).
            "List-Unsubscribe": "<mailto:hello@paydochub.com?subject=unsubscribe>",
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mailjet send ${res.status}: ${body}`);
  }
}

function welcomeHtml(intro: string): string {
  const bg = "#EEEFE9";
  const accent = "#F9BD2B";
  const ink = "#1D1F27";
  const link = "#1D4044";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to PayDocHub</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FFFFFF;border:2px solid ${ink};box-shadow:4px 4px 0 ${ink};">
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${accent};border:2px solid ${ink};width:40px;height:40px;text-align:center;vertical-align:middle;font-size:22px;font-weight:800;color:${ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;line-height:40px;">P</td>
                  <td style="padding-left:12px;font-size:20px;font-weight:800;color:${ink};letter-spacing:-0.01em;">PayDocHub</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0 32px;">
              <h1 style="margin:0 0 12px 0;font-size:28px;line-height:1.2;font-weight:800;color:${ink};letter-spacing:-0.01em;">Thanks for joining</h1>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:${ink};">
                ${intro}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <p style="margin:16px 0 8px 0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${ink};">While you wait</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:6px 0;">
                    <a href="https://paydochub.com/companies" style="color:${link};font-size:16px;font-weight:600;text-decoration:underline;">Find your employer</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <a href="https://paydochub.com/paystub-maker" style="color:${link};font-size:16px;font-weight:600;text-decoration:underline;">Create a pay stub</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 28px 32px;">
              <p style="margin:24px 0 0 0;padding-top:16px;border-top:1px solid ${ink};font-size:14px;line-height:1.5;color:#4A4B52;">
                You subscribed at <a href="https://paydochub.com" style="color:${link};text-decoration:underline;">paydochub.com</a>.<br>
                To unsubscribe, email <a href="mailto:hello@paydochub.com?subject=unsubscribe" style="color:${link};text-decoration:underline;">hello@paydochub.com</a> with subject "unsubscribe".
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
