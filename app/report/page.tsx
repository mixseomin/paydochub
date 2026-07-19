import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Report a Listing / Brand Removal",
  description:
    "Brand owners and authorized representatives: request removal of a PayDocHub page. Verified requests are actioned within 24 hours.",
  alternates: { canonical: "/report" },
  robots: { index: false, follow: false },
};

export default function ReportPage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "Report", path: "/report" }])} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Report a listing / brand removal</h1>
      <p className="text-base text-muted mb-4 leading-relaxed">
        PayDocHub is an independent informational resource and is not affiliated with any employer.
        If you are a brand owner or an authorized representative and want a page removed - for a
        trademark concern, a data issue, or any other reason - submit it below.
      </p>
      <p className="text-sm text-muted mb-8 leading-relaxed">
        We respond quickly on purpose: a verified brand-removal request is actioned{" "}
        <strong>within 24 hours</strong>, so there is no need to escalate to our host or CDN. You
        will see a confirmation as soon as it is received.
      </p>
      <ReportForm />
    </article>
  );
}
