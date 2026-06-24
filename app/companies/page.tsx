import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import { EMPLOYERS } from "../lib/employers";
import { CompaniesList } from "./CompaniesList";

export const metadata: Metadata = {
  title: "All Employers - PayDocHub",
  description:
    "Browse every US employer covered by PayDocHub. Find employee portal login, pay stub access, and W-2 instructions for your company.",
  alternates: { canonical: "/companies" },
  openGraph: { url: "/companies" },
};

export default function CompaniesPage() {
  // Higher pv = more searched = surface a "Popular" hint on the top names.
  const popularCutoff = EMPLOYERS[Math.min(11, EMPLOYERS.length - 1)]?.pv ?? 0;
  const employers = EMPLOYERS.map((e) => ({
    name: e.name,
    slug: e.slug,
    popular: e.pv >= popularCutoff,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "Companies", path: "/companies" }])} />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">All employers</h1>
        <p className="text-base leading-relaxed text-muted">
          {EMPLOYERS.length} US employers, each with a guide to the employee portal login, pay
          stub access, and W-2 forms. Pick yours to get started.
        </p>
      </header>

      <CompaniesList employers={employers} />
    </div>
  );
}
