import { readFile } from "fs/promises";
import { NextResponse } from "next/server";

// Runtime blocklist read by middleware. Lives with reports OUTSIDE the repo
// (survives deploy.sh git reset --hard). Empty when the file doesn't exist yet.
export const dynamic = "force-dynamic";

const FILE = `${process.env.REPORT_DIR || "/opt/paydochub-reports"}/blocked.json`;

export async function GET() {
  try {
    const arr = JSON.parse(await readFile(FILE, "utf8"));
    return NextResponse.json(Array.isArray(arr) ? arr : []);
  } catch {
    return NextResponse.json([]);
  }
}
