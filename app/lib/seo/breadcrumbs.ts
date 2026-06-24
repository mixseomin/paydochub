export const SITE_URL = "https://paydochub.com";

export type Crumb = { name: string; path: string };

/**
 * Build a schema.org BreadcrumbList JSON-LD object from an ordered list of
 * crumbs. `path` is a site-root-relative path ("/bah") or "/" for Home.
 * Always include Home as the first crumb.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

/**
 * Convenience wrapper: prepends Home and returns the JSON-LD object.
 *   breadcrumbs([{ name: "BAH", path: "/bah" }, { name: "Fort Bragg", path: "/bah/fort-bragg" }])
 *   => Home > BAH > Fort Bragg
 */
export function breadcrumbs(trail: Crumb[]) {
  return breadcrumbJsonLd([{ name: "Home", path: "/" }, ...trail]);
}
