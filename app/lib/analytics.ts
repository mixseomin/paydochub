import { useEffect, useRef } from "react";

type Params = Record<string, string | number | boolean | undefined>;

/** Fire a GA4 custom event. No-op during SSR or before gtag loads. */
export function trackEvent(name: string, params?: Params): void {
  if (typeof window === "undefined") return;
  (window as Window & { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, params);
}

/** Fire `name` exactly once, the first time `when` becomes true (e.g. a calc
 *  producing a valid result). Params are captured at fire time. */
export function useTrackOnce(name: string, params: Params, when: boolean): void {
  const fired = useRef(false);
  useEffect(() => {
    if (when && !fired.current) {
      fired.current = true;
      trackEvent(name, params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when, name]);
}
