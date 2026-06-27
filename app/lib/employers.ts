import employers from "../../data/employers.json";

export type Employer = {
  name: string;
  slug: string;
  pv: number;
  demand: number;
  platforms: string[];
  examples: string[];
  portal?: string; // verified official employee-portal URL (researched employers only)
};

// Already sorted by page-views (pv) descending in the source file.
export const EMPLOYERS: Employer[] = employers as Employer[];

const BY_SLUG = new Map(EMPLOYERS.map((e) => [e.slug, e]));

export function findEmployer(slug: string): Employer | undefined {
  return BY_SLUG.get(slug);
}

/**
 * Next-highest-pv employers other than the one given. Since EMPLOYERS is
 * sorted by pv desc, "the rest of the list minus self" is already ranked.
 */
export function relatedEmployers(slug: string, n = 6): Employer[] {
  return EMPLOYERS.filter((e) => e.slug !== slug).slice(0, n);
}
