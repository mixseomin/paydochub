import { ImageResponse } from "next/og";

// edge runtime 502s on this Hetzner host; nodejs is the working runtime for OG generation.
export const runtime = "nodejs";
export const alt = "PayDocHub - Employee login, pay stubs & W-2 access";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "70px",
          background: "#FFFFFF",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#1B1B1B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              background: "#005EA2",
              color: "#FFFFFF",
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 56,
            }}
          >
            P
          </div>
          <div style={{ fontWeight: 900, fontSize: 44, letterSpacing: -0.5 }}>
            PayDocHub
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 16px",
              background: "#005EA2",
              color: "#FFFFFF",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            US employers
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "0 16px",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            <span>Your pay docs,</span>
            <span style={{ background: "#005EA2", color: "#FFFFFF", padding: "0 12px" }}>found fast.</span>
          </div>
          <div style={{ fontSize: 32, color: "#565C65", marginTop: 12 }}>
            Employee login · Pay stubs · W-2 access
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#565C65",
            fontSize: 24,
          }}
        >
          <div>paydochub.com</div>
          <div>Login · Pay stub · W-2</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
