import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldAlert, FileText, KeyRound, ChevronRight } from "lucide-react";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs, SITE_URL } from "../lib/seo/breadcrumbs";
import { EMPLOYERS, findEmployer, relatedEmployers } from "../lib/employers";

export const dynamicParams = false;

export function generateStaticParams() {
  return EMPLOYERS.map((e) => ({ company: e.slug }));
}

type Params = { company: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { company } = await params;
  const e = findEmployer(company);
  if (!e) return {};
  return {
    title: `${e.name} Employee Login, Pay Stub & W-2 Access (2026)`,
    description: `How to log in to your ${e.name} employee portal, view or download your pay stub, and get your ${e.name} W-2 tax form. A plain-English ${e.name} access guide for 2026.`,
    alternates: { canonical: `/${e.slug}` },
    openGraph: { url: `/${e.slug}` },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { company } = await params;
  const e = findEmployer(company);
  if (!e) notFound();

  const platformList = e.platforms.length ? e.platforms.join(" and ") : "";
  const related = relatedEmployers(e.slug);

  const faqs = [
    {
      q: `When will I get my ${e.name} W-2?`,
      a: `Employers must furnish W-2 forms by January 31 each year, so your ${e.name} W-2 for the prior tax year should be available - in the portal or by mail - by the end of January.`,
    },
    {
      q: `I lost my ${e.name} pay stub - what can I do?`,
      a: `Log back in to the ${e.name} employee portal and reprint it from the Pay or Payroll section, where past stubs are usually stored. If you no longer have access, ask ${e.name} payroll or HR to resend it.`,
    },
    {
      q: `How do I reset my ${e.name} employee portal password?`,
      a: `Use the "Forgot password" link on the portal login screen to reset by email or text. If you are locked out or the reset does not arrive, contact ${e.name} HR or your IT help desk.`,
    },
    {
      q: `Can I still access pay stubs after leaving ${e.name}?`,
      a: `Former employees often keep portal access for a limited time, then lose it. If you can no longer log in, request copies of your final pay stubs and W-2 directly from ${e.name} payroll.`,
    },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${e.name} Employee Portal: Login, Pay Stub & W-2`,
    description: `How to log in to your ${e.name} employee portal, get your pay stub, and access your ${e.name} W-2.`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/${e.slug}` },
    author: { "@type": "Organization", name: "PayDocHub" },
    publisher: { "@type": "Organization", name: "PayDocHub" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd
        data={[
          breadcrumbs([
            { name: "Companies", path: "/companies" },
            { name: e.name, path: `/${e.slug}` },
          ]),
          articleJsonLd,
          faqJsonLd,
        ]}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight size={14} className="text-muted-2" />
        <Link href="/companies" className="hover:underline">Companies</Link>
        <ChevronRight size={14} className="text-muted-2" />
        <span className="text-foreground font-medium">{e.name}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {e.name} Employee Portal: Login, Pay Stub &amp; W-2
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-2">
        A plain-English guide to logging in to your {e.name} employee account, viewing
        or downloading your pay stub, and getting your {e.name} W-2 tax form.
      </p>
      {platformList && (
        <p className="text-base text-muted leading-relaxed mb-2">
          {e.name} uses {platformList} for time, scheduling, and pay access.
        </p>
      )}

      {/* 1. Login */}
      <Section title={`Access your ${e.name} employee portal`}>
        <ol className="list-decimal pl-5 space-y-2 text-base leading-relaxed">
          <li>
            Go to the official {e.name} employee portal
            {platformList ? ` (typically the ${platformList} sign-in page)` : ""}. Always
            start from {e.name}&apos;s own site or a link your HR gave you, not a search ad.
          </li>
          <li>Enter your employee ID or username.</li>
          <li>Enter your password, then submit to sign in.</li>
          <li>
            Locked out? Use the &quot;Forgot password&quot; link on the login screen, or
            contact {e.name} HR to reset your account.
          </li>
        </ol>
      </Section>

      {/* 2. Pay stub */}
      <Section title={`How to get your ${e.name} pay stub`}>
        <ol className="list-decimal pl-5 space-y-2 text-base leading-relaxed">
          <li>Log in to the {e.name} employee portal.</li>
          <li>Open the Pay or Payroll section (sometimes labeled &quot;Pay statements&quot; or &quot;Earnings&quot;).</li>
          <li>Select the pay period you need, then view or download the PDF.</li>
          <li>No portal access? Contact {e.name} HR or payroll and ask them to send your pay stub.</li>
        </ol>
        <div className="card p-5 mt-5" style={{ background: "var(--teal)", color: "var(--teal-fg)" }}>
          <div className="flex items-start gap-3">
            <FileText size={20} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base mb-1">Need a pay stub now?</div>
              <p className="text-sm leading-relaxed mb-3 opacity-90">
                Create a professional pay stub in minutes - useful for proof of income, a lost
                stub, or self-employed work.
              </p>
              <Link href="/paystub-maker" className="btn bg-white text-foreground font-semibold inline-flex items-center gap-1.5">
                Create a pay stub <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. W-2 */}
      <Section title={`How to get your ${e.name} W-2`}>
        <p className="text-base leading-relaxed mb-3">
          Employers must furnish your W-2 by <strong>January 31</strong> each year. To get your{" "}
          {e.name} W-2, sign in to the employee portal and open the Tax Documents (or
          Year-End) section, where the current and prior W-2 forms are usually posted.
        </p>
        <p className="text-base leading-relaxed">
          If your W-2 is missing or you can no longer log in, contact {e.name} payroll to
          request a copy. As a last resort - if you still cannot get it - you can file{" "}
          <a
            href="https://www.irs.gov/forms-pubs/about-form-4852"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal font-semibold underline"
          >
            IRS Form 4852
          </a>{" "}
          as a substitute for a missing W-2.
        </p>
      </Section>

      {/* 4. Stay safe */}
      <Section title="Stay safe">
        <div className="card p-5 flex items-start gap-3">
          <ShieldAlert size={20} className="shrink-0 mt-0.5 text-teal" />
          <p className="text-sm leading-relaxed text-foreground/85">
            Only log in through the official {e.name} site. Never share your SSN, login, or
            password by email or text, and watch for phishing pages that copy the real portal.
            {e.name} will not ask for your full password over email.
          </p>
        </div>
      </Section>

      {/* 5. FAQ */}
      <Section title="Frequently asked questions">
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="card p-4">
              <div className="flex items-start gap-2.5 mb-1.5">
                <KeyRound size={16} className="shrink-0 mt-0.5 text-teal" />
                <h3 className="font-bold text-base">{f.q}</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground/85 pl-[26px]">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Related */}
      <Section title="Other employers">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.slug}`}
              className="card p-4 block hover:border-accent transition-colors"
            >
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs text-muted mt-0.5">Login, pay stub &amp; W-2 guide</div>
            </Link>
          ))}
        </div>
        <div className="card p-5 mt-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold text-base">Need a pay stub for any job?</div>
            <p className="text-sm text-muted">Generate one in minutes.</p>
          </div>
          <Link href="/paystub-maker" className="btn btn-primary inline-flex items-center gap-1.5">
            Create a pay stub <ArrowRight size={15} />
          </Link>
        </div>
      </Section>

      <p className="text-xs text-muted-2 leading-snug mt-10">
        PayDocHub is an independent informational resource and is not affiliated with, endorsed
        by, or connected to {e.name}. Company names and trademarks belong to their respective
        owners.
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}
