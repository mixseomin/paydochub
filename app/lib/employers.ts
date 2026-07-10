import employers from "../../data/employers.json";

export type Employer = {
  name: string;
  slug: string;
  pv: number;
  demand: number;
  platforms: string[];
  examples: string[];
  portal?: string; // verified official employee-portal URL (researched employers only)
  logo?: boolean;  // true when public/logos/<slug>.png exists (Wikidata-sourced)
  shot?: boolean;  // true when public/shots/<slug>.png exists (portal screenshot)
};

// Already sorted by page-views (pv) descending in the source file.
export const EMPLOYERS: Employer[] = employers as Employer[];

/**
 * A page is "rich" enough to index when it carries at least 2 of the 3 unique
 * per-employer signals (verified portal URL, named payroll platforms, portal
 * screenshot). Below that it's ~95% templated advice with only the name swapped
 * in - exactly what Google bulk-marks "Crawled - currently not indexed". Those
 * pages stay live but get noindex+follow and leave the sitemap so the thin bulk
 * (561 of 600) stops dragging the domain's quality signal. Fill a page's data to
 * flip it back to indexed. Prune decision: earns-strategy 2026-07-11.
 */
export function isRichEmployer(e: Employer): boolean {
  const score = (e.portal ? 1 : 0) + (e.platforms.length ? 1 : 0) + (e.shot ? 1 : 0);
  return score >= 2;
}

const BY_SLUG = new Map(EMPLOYERS.map((e) => [e.slug, e]));

export function findEmployer(slug: string): Employer | undefined {
  return BY_SLUG.get(slug);
}

/**
 * Related employers for the in-page "Other employers" links. Mixes 2 popular
 * anchors (highest pv = the pages worth funneling link equity to) with forward
 * neighbors in the pv-sorted ring. The ring matters for crawl: every tail page
 * then gets inbound links from its neighbors, not just the /companies hub, so
 * link equity spreads across all 600 instead of pooling on the same top 6.
 */
export function relatedEmployers(slug: string, n = 6): Employer[] {
  const i = EMPLOYERS.findIndex((e) => e.slug === slug);
  if (i < 0) return EMPLOYERS.slice(0, n);
  const out: Employer[] = [];
  const seen = new Set([slug]);
  const push = (e?: Employer) => {
    if (e && !seen.has(e.slug)) { seen.add(e.slug); out.push(e); }
  };
  push(EMPLOYERS[0]);
  push(EMPLOYERS[1]);
  for (let k = 1; out.length < n && k <= EMPLOYERS.length; k++) {
    push(EMPLOYERS[(i + k) % EMPLOYERS.length]);
  }
  return out.slice(0, n);
}
