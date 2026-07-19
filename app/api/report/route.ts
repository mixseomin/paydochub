import { NextRequest, NextResponse } from "next/server";
import { appendFileSync, mkdirSync } from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reports are appended OUTSIDE the git repo so `git reset --hard` on deploy can't wipe them.
const STORE_DIR = process.env.REPORT_DIR || "/opt/paydochub-reports";
const STORE = `${STORE_DIR}/reports.jsonl`;

// ponytail: fixed-answer captcha + honeypot + time-trap + rate-limit. Stops bots on a
// low-volume takedown form without a 3rd-party dep. Upgrade to Cloudflare Turnstile
// (site is already on CF) if a human abuser floods it — needs a sitekey from the CF dash.
const CAPTCHA_ANSWER = "7"; // question rendered on the page: "What is 3 + 4?"

const recent = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 6;
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
  if (recent.size > 5000)
    for (const [k, ts] of recent) if (!ts.some((t) => now - t < WINDOW_MS)) recent.delete(k);
  return false;
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { url = "", brand = "", email = "", role = "", details = "", captcha = "", website = "", t = "" } = body;

  // honeypot: real users never fill the hidden `website` field
  if (website) return NextResponse.json({ ok: true });
  // time-trap: a human can't fill this form in under 3s
  const elapsed = Date.now() - Number(t || 0);
  if (!t || elapsed < 3000) return NextResponse.json({ error: "too fast" }, { status: 400 });
  if (String(captcha).trim() !== CAPTCHA_ANSWER)
    return NextResponse.json({ error: "captcha" }, { status: 400 });
  if (!brand || !email || (!url && !details))
    return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const ip = clientIp(req);
  if (rateLimited(ip)) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const rec = {
    ts: new Date().toISOString(),
    ip,
    brand: String(brand).slice(0, 120),
    url: String(url).slice(0, 300),
    email: String(email).slice(0, 160),
    role: String(role).slice(0, 80),
    details: String(details).slice(0, 2000),
  };
  try {
    mkdirSync(STORE_DIR, { recursive: true });
    appendFileSync(STORE, JSON.stringify(rec) + "\n");
  } catch (e) {
    console.error("[report] store failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  // Also to journalctl so `journalctl -u paydochub | grep '\[report\]'` surfaces new ones.
  console.log(`[report] brand=${rec.brand} url=${rec.url} email=${rec.email}`);
  return NextResponse.json({ ok: true });
}
