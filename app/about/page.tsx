import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "PayDocHub is an independent guide to employee portal logins, pay stubs, and W-2 access for US employers. No funnel, no sign-up gate.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "About", path: "/about" }])} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">About PayDocHub</h1>

      <div className="text-lg leading-relaxed space-y-5 mb-10">
        <p>
          PayDocHub is a growing directory of plain-English guides that help employees find their
          employer&apos;s portal login, view or download a pay stub, and get their W-2 tax form.
        </p>
        <p>
          The site exists because finding these things is harder than it should be. Portal names
          change, the link is buried, and a quick search turns up ads instead of the real steps.
          Each PayDocHub page lays out the steps for one employer in one place.
        </p>
        <p>
          It is simple: find your employer, follow the steps, and create a pay stub if you need one.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-3">Independent and unaffiliated</h2>
      <p className="text-base leading-relaxed mb-5">
        PayDocHub is an independent informational resource. It is not affiliated with, endorsed by,
        or connected to any employer. Company names and trademarks belong to their respective
        owners. We do not host or operate any employer&apos;s login system - we point you to the
        official one and explain the steps.
      </p>

      <h2 className="text-xl font-bold mb-3">Privacy promises</h2>
      <ul className="text-sm leading-relaxed mb-10 space-y-2 list-disc pl-5">
        <li>We never ask for your portal login, password, or Social Security number.</li>
        <li>No mailing list rental, no data sale.</li>
        <li>If you join the waitlist, unsubscribe is one click.</li>
      </ul>

      <h2 className="text-xl font-bold mb-3">Contact</h2>
      <p className="text-base leading-relaxed">
        Found a wrong step, broken page, or want an employer we do not cover yet?{" "}
        <Link href="/contact" className="text-teal font-semibold underline">Drop a note</Link>.
      </p>
    </article>
  );
}
