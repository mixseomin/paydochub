import { ImageResponse } from "next/og";

// iOS "Add to Home Screen" icon. Full-bleed navy tile with the white "G"
// civic mark - matches the favicon (app/icon.svg) and the header logo. iOS
// rounds the corners itself, so the tile is full-bleed (no border).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#005EA2",
          color: "#FFFFFF",
          fontSize: 120,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
