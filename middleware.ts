import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serve 410 for reported/blocked employer pages without a rebuild. The blocklist
// lives outside the repo and is read via /api/blocked; cache it 30s so this costs
// ~one fetch per 30s, not one per request. Employer pages stay statically generated.
let cache = { at: 0, set: new Set<string>() };

async function blockedSlugs(req: NextRequest): Promise<Set<string>> {
  if (Date.now() - cache.at < 30_000) return cache.set;
  try {
    const res = await fetch(new URL("/api/blocked", req.url), { cache: "no-store" });
    const arr = res.ok ? await res.json() : [];
    cache = { at: Date.now(), set: new Set<string>(Array.isArray(arr) ? arr : []) };
  } catch {
    /* keep stale cache on failure */
  }
  return cache.set;
}

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.slice(1);
  if (!slug || slug.includes("/")) return NextResponse.next();
  if ((await blockedSlugs(req)).has(slug)) {
    return new NextResponse("This page has been removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return NextResponse.next();
}

// Single-segment paths only; skip api, _next, and anything with a file extension.
export const config = { matcher: ["/((?!api|_next/|.*\\.).*)"] };
