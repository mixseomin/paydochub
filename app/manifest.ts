import type { MetadataRoute } from "next";

// Android / desktop "Add to Home Screen" + install metadata. iOS uses the
// apple-icon route instead; this keeps the navy P mark consistent everywhere.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PayDocHub - Employee Login, Pay Stubs & W-2 Access",
    short_name: "PayDocHub",
    description:
      "Find any US employer's employee portal login, pay stub access, and W-2 tax forms. No sign-up.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#005EA2",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
