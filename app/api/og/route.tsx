import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// edge runtime 502s on this Hetzner host; nodejs is the working runtime for OG.
export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

/**
 * Dynamic per-result OG card.
 *
 * GET /api/og?headline=<urlenc>&value=<urlenc>&sub=<urlenc>&tag=<urlenc>
 *
 *   value    big VALUE token        e.g. "$2,481/mo"
 *   headline use-case / decision    e.g. "Claim Social Security at 62 or wait to 67?"
 *   sub      muted context line     e.g. "PIA at full retirement age, 2026 figures"
 *   tag      uppercase pill         e.g. "SOCIAL SECURITY"
 *
 * Satori-safe: every <div> with more than one child carries display:flex.
 * No inline-flex anywhere.
 */
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const value = (sp.get("value") ?? "").slice(0, 24);
  const headline =
    (sp.get("headline") ?? "Your pay docs, found fast.").slice(0, 220);
  const sub = (sp.get("sub") ?? "").slice(0, 120);
  const tag = (sp.get("tag") ?? "PAYDOCHUB").slice(0, 28).toUpperCase();

  // Scale the headline down as it gets longer so long decision lines still fit.
  const headlineSize = headline.length > 150 ? 40 : headline.length > 90 ? 46 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 70px",
          background: "#EEEFE9",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#1D1F27",
        }}
      >
        {/* brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              background: "#F9BD2B",
              border: "4px solid #1D1F27",
              borderRadius: 12,
              boxShadow: "6px 6px 0 #1D1F27",
              fontWeight: 900,
              fontSize: 50,
            }}
          >
            P
          </div>
          <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: -0.5 }}>
            PayDocHub
          </div>
        </div>

        {/* body: tag + value + headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "7px 16px",
              marginBottom: 22,
              background: "#F9BD2B",
              border: "3px solid #1D1F27",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1.5,
            }}
          >
            {tag}
          </div>

          {value ? (
            <div
              style={{
                display: "flex",
                fontSize: 116,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -2,
                marginBottom: 22,
              }}
            >
              {value}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: headlineSize,
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: -0.5,
              maxWidth: 1060,
            }}
          >
            {headline}
          </div>

          {sub ? (
            <div style={{ display: "flex", fontSize: 28, color: "#6F6F6F", marginTop: 20 }}>
              {sub}
            </div>
          ) : null}
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6F6F6F",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700, color: "#1D1F27" }}>
            paydochub.com
          </div>
          <div style={{ display: "flex" }}>Login · Pay stub · W-2</div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        // Deterministic per query string (length-capped, seeded templates) -> safe to
        // hard-cache at the CF edge so unfurl storms during the blast never hit origin.
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    },
  );
}
