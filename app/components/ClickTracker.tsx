"use client";

import { trackEvent } from "../lib/analytics";

/**
 * Delegates clicks within its subtree: any clicked element whose nearest
 * ancestor carries `data-track` fires `event` with that value as item_id.
 * Layout-neutral (display:contents), so server-rendered children (e.g. the SSR
 * location cards on /bah/locations) keep their own markup and stay static.
 */
export function ClickTracker({
  event,
  children,
}: {
  event: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ display: "contents" }}
      onClick={(e) => {
        const el = (e.target as HTMLElement).closest("[data-track]");
        if (el) trackEvent(event, { item_id: el.getAttribute("data-track") || undefined });
      }}
    >
      {children}
    </div>
  );
}
