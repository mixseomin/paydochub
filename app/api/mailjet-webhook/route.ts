import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const LOG_DIR = "/var/log/paydochub";
const LOG_FILE = path.join(LOG_DIR, "mailjet-events.jsonl");

// Shared-secret token in the webhook URL (?t=...). Mailjet does not sign payloads,
// so a secret URL is the practical auth. Configure the Mailjet event URL as
// https://paydochub.com/api/mailjet-webhook?t=<MJ_WEBHOOK_TOKEN>. Fail closed:
// if no token is configured, the endpoint accepts nothing (no public write surface).
const TOKEN = process.env.MJ_WEBHOOK_TOKEN || "";

const MAX_EVENTS = 50; // one Mailjet batch; caps single-request amplification
const MAX_LOG_BYTES = 50 * 1024 * 1024; // stop appending past 50MB (disk-fill guard)
const cap = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : v);

type MailjetEvent = {
  event?: string;
  email?: string;
  mj_campaign_id?: number;
  mj_message_id?: string;
  error?: string;
  error_related_to?: string;
  time?: number;
};

async function appendBatch(lines: string[]) {
  if (lines.length === 0) return;
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    // Disk-fill guard: skip writing once the log is large (rotate/clear manually).
    try {
      const st = await fs.stat(LOG_FILE);
      if (st.size > MAX_LOG_BYTES) {
        console.error("Mailjet webhook log over cap, skipping append");
        return;
      }
    } catch {
      /* file may not exist yet - fine */
    }
    await fs.appendFile(LOG_FILE, lines.join("\n") + "\n"); // single write for the whole batch
  } catch (e) {
    console.error("Mailjet webhook log fail:", e);
  }
}

export async function POST(req: NextRequest) {
  // Auth: reject anything without the configured secret token (fail closed).
  if (!TOKEN || req.nextUrl.searchParams.get("t") !== TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: MailjetEvent | MailjetEvent[];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const events = (Array.isArray(body) ? body : [body]).slice(0, MAX_EVENTS);
  const now = Math.floor(Date.now() / 1000);
  const lines = events.map((e) =>
    JSON.stringify({
      received_at: now,
      event: cap(e.event, 40),
      email: cap(e.email, 254),
      campaign: e.mj_campaign_id,
      msg_id: cap(e.mj_message_id, 64),
      error: cap(e.error || e.error_related_to, 200),
      mj_time: e.time,
    }),
  );
  await appendBatch(lines);

  return NextResponse.json({ ok: true, received: events.length });
}

// No public confirmation of the endpoint's existence.
export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
