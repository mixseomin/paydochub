"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

/**
 * Fires once when an embed loads, recording which widget + which host site
 * embedded it (from document.referrer). No backend - it rides GA4, so the
 * "who is embedding us" list shows up as the embed_view event by embed_host.
 */
export function EmbedBeacon() {
  useEffect(() => {
    try {
      const ref = document.referrer || "";
      const host = ref ? new URL(ref).hostname : "(direct)";
      const calc = location.pathname.replace("/embed/", "").split("/")[0] || "unknown";
      trackEvent("embed_view", { item_id: calc, embed_host: host });
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
