import type { MetadataRoute } from "next";
import { EMPLOYERS, isRichEmployer } from "./lib/employers";

const BASE = "https://paydochub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = "2026-06-24";

  const fixed: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,              lastModified: today, changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE}/companies`,     lastModified: today, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/paystub-maker`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`,           lastModified: today, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,         lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,       lastModified: today, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,       lastModified: today, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,         lastModified: today, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Only the rich, genuinely-unique employer pages go in the sitemap; the ~561 thin
  // templated ones are noindex+follow (see isRichEmployer / earns-strategy 2026-07-11).
  const employers: MetadataRoute.Sitemap = EMPLOYERS.filter(isRichEmployer).map((e) => ({
    url: `${BASE}/${e.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...fixed, ...employers];
}
