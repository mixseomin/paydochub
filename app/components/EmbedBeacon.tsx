"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

/**
 * On embed load:
 * (1) fire embed_view with the embedding host from document.referrer - best-effort only,
 *     because GA4 inside a cross-origin iframe is often blocked by third-party storage,
 *     so this event can silently drop (it did: 0 events in the wild).
 * (2) Stamp that host onto every outbound utm_source=embed link as utm_content, so when a
 *     visitor clicks through to the first-party site GA4 reliably records
 *     source=embed + content=<host> = who is actually embedding us. Capture-phase click
 *     listener so it also catches links rendered dynamically by the widget.
 */
export function EmbedBeacon() {
  useEffect(() => {
    let host = "(direct)";
    try {
      const ref = document.referrer || "";
      if (ref) host = new URL(ref).hostname;
      const calc = location.pathname.replace("/embed/", "").split("/")[0] || "unknown";
      trackEvent("embed_view", { item_id: calc, embed_host: host });
    } catch {
      /* ignore */
    }
    const h = encodeURIComponent(host);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href*="utm_source=embed"]') as HTMLAnchorElement | null;
      if (a && !a.href.includes("utm_content=")) {
        a.href += (a.href.includes("?") ? "&" : "?") + "utm_content=" + h;
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
