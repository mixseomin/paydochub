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
