import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report a wrong step, request an employer we don't cover, or just say hi. Every email read personally.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "Contact", path: "/contact" }])} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact</h1>
      <p className="text-base text-muted mb-10 leading-relaxed">
        I read every email personally. Whether you found a wrong step, want an employer we do not cover yet, or just have a question - the inbox is open.
      </p>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Mail size={20} className="text-teal" />
          <h2 className="font-bold text-lg">Email</h2>
        </div>
        <a href="mailto:hello@paydochub.com" className="text-base text-teal underline font-semibold">hello@paydochub.com</a>
        <p className="text-sm text-muted mt-2">Typical response: within 2 business days. Faster for reported errors.</p>
      </div>

      <div className="card p-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare size={20} className="text-teal" />
          <h2 className="font-bold text-lg">What to include</h2>
        </div>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><b>Reporting a wrong step:</b> the URL of the employer page and what you found was out of date or incorrect.</li>
          <li><b>Requesting an employer:</b> the company name and, if you know it, the payroll or HR system they use.</li>
          <li><b>Privacy / data:</b> please put "Privacy" in the subject line so it gets prioritized.</li>
        </ul>
      </div>

      <p className="text-sm text-muted">
        Currently the site is built and maintained solo. There is no help desk, no support tier, no chatbot. Just a person who reads inbox.
      </p>
    </article>
  );
}
