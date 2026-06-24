import { SITE_URL } from "./breadcrumbs";

/**
 * Organization JSON-LD. Emitted ONCE, site-wide, from app/layout.tsx.
 * `sameAs` is intentionally empty until official social profiles exist.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PayDocHub",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "PayDocHub helps employees find their employer's portal login, pay stub access, and W-2 tax forms. Independent informational resource, not affiliated with any employer.",
    sameAs: [] as string[],
  };
}
