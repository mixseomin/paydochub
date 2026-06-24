import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PayDocHub terms of service. Informational only - confirm details with your employer or payroll before acting.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "Terms", path: "/terms" }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-xs text-muted mb-8">Last updated: June 19, 2026</p>

      <Section title="Informational only">
        PayDocHub describes how to log in to employee portals, find pay stubs, and access W-2 forms. Portal names, links, and steps change over time and may differ for your account. Always confirm the current process with your employer or payroll. PayDocHub does not provide legal, tax, or financial advice.
      </Section>

      <Section title="Not affiliated with any employer">
        PayDocHub is an independent project. It is not affiliated with, endorsed by, or in any way connected to any employer named on this site. Company names and trademarks belong to their respective owners.
      </Section>

      <Section title="Affiliate links">
        Some outbound links to third-party services may be affiliate links. If you sign up through one,
        PayDocHub may earn a commission at no extra cost to you. This never affects the steps we publish
        or which services we mention. We only link to services we consider relevant and we are not
        responsible for third-party sites.
      </Section>

      <Section title="Use of the site">
        <p>You may:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Read and use the guides freely for personal reference.</li>
          <li>Share PayDocHub page URLs with anyone.</li>
        </ul>
        <p className="mt-3">You may not:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Scrape the site at high volume that affects availability for others.</li>
          <li>Use automated tools to submit subscription forms in bulk.</li>
          <li>Use the pay stub generator to misrepresent income to any person or organization.</li>
        </ul>
      </Section>

      <Section title="No warranty">
        PayDocHub is provided "as is" without any warranty, express or implied. We do not guarantee accuracy, fitness for any particular purpose, or uninterrupted availability. Your use of the site is at your own risk.
      </Section>

      <Section title="Limitation of liability">
        To the maximum extent permitted by law, PayDocHub and its operator are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the site or reliance on its content.
      </Section>

      <Section title="Changes">
        We may update these terms. Material changes will be announced via the email list and posted here with an updated date.
      </Section>

      <Section title="Contact">
        Questions: <a href="mailto:hello@paydochub.com" className="text-teal font-semibold underline">hello@paydochub.com</a>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
