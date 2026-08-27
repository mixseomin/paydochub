import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How PayDocHub makes money: which links pay us a commission, what that never changes, and which affiliate networks we work with.",
  alternates: { canonical: "/affiliate-disclosure" },
  openGraph: { url: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-10 prose-sm">
      <JsonLd data={breadcrumbs([{ name: "Affiliate Disclosure", path: "/affiliate-disclosure" }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Affiliate Disclosure</h1>
      <p className="text-xs text-muted mb-8">Last updated: August 27, 2026</p>

      <Section title="The short version">
        Some links on PayDocHub are affiliate links. If you click one and then sign up or buy, the company may pay us a commission. Your price is the same either way. Those commissions are what keep this site free, with no paywall and no account required.
      </Section>

      <Section title="Where those links appear">
        Company pages and guides sometimes link to payroll, tax filing and HR services. Partner links are marked as sponsored in the page markup, and we keep them out of the calculator results themselves.
      </Section>

      <Section title="What a commission never changes">
        <ul>
          <li>Portal addresses and company details come from public employer pages. A partner can&apos;t pay to change a number, a rate, or a source.</li>
          <li>Nobody buys a ranking or a recommendation here. If we ever run a comparison, the criteria are published on the page.</li>
          <li>We turn down partners whose offer doesn&apos;t fit what the reader came here to do.</li>
        </ul>
      </Section>

      <Section title="Who pays us">
        We work through affiliate networks, currently CJ Affiliate, Awin, Impact and Rakuten Advertising, and occasionally with a brand directly. The network tracks the click and reports any commission back to us. We don&apos;t receive your name, your email, or anything you typed into a calculator as part of that reporting.
      </Section>

      <Section title="Your choice">
        Every affiliate link is optional. You can search for the same company yourself and pay exactly what you&apos;d pay through us. Nothing on this site is gated behind clicking one.
      </Section>

      <Section title="Standards we follow">
        This disclosure follows the Federal Trade Commission guidance on endorsements and testimonials (16 CFR Part 255). If you think a link here is unclear or badly placed, tell us and we&apos;ll fix it.
      </Section>

      <Section title="Contact">
        Questions about this disclosure: <a href="mailto:hello@paydochub.com">hello@paydochub.com</a>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 [&_a]:text-teal [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
