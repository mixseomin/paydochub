import { NextRequest, NextResponse } from "next/server";

// Reads Cloudflare's visitor-location headers (enabled via the zone's
// "Add visitor location headers" managed transform). Used to prefill state /
// region defaults without a permission prompt. Approximate by design - the UI
// labels it as an editable estimate. Must stay dynamic (reads request headers)
// so it never gets statically optimized.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const h = req.headers;
  const country = (h.get("cf-ipcountry") || "").toUpperCase();
  const postal = (h.get("cf-postal-code") || "").trim();
  const city = h.get("cf-ipcity") || "";
  const region = h.get("cf-region-code") || "";

  const res = NextResponse.json({
    zip: country === "US" && /^\d{5}$/.test(postal) ? postal : null,
    city: city || null,
    region: region || null,
    country: country || null,
    source: "ip",
  });
  // Per-visitor, location-specific: never cache at the edge.
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
