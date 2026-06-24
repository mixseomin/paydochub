import Script from "next/script";

/**
 * Affiliate layer. Awin MasterTag rewrites outbound links to advertisers the
 * publisher has JOINED into commissionable ones at click time. Env-gated:
 *   NEXT_PUBLIC_AWIN_PUB = "410323"  (Awin publisher id)
 * lazyOnload keeps it off the critical path.
 *
 * NOTE: do NOT add Skimlinks here - it cannot be registered for this portfolio.
 * For tax/finance merchant coverage (TurboTax, brokerages) apply to those
 * advertisers via CJ / Awin dashboards.
 */
export function MonetizationScripts() {
  const awin = process.env.NEXT_PUBLIC_AWIN_PUB;
  if (!awin) return null;
  return (
    <Script
      id="awin-mastertag"
      strategy="lazyOnload"
      src={`https://www.dwin2.com/pub.${awin}.min.js`}
    />
  );
}
