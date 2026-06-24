import type { Metadata } from "next";
import { FileText, Briefcase, RefreshCcw } from "lucide-react";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import { SubscribeForm } from "../components/SubscribeForm";

export const metadata: Metadata = {
  title: "Pay Stub Generator - Launching Soon",
  description:
    "A simple, honest pay stub generator for proof of income, replacing a lost stub, and self-employed or contract work. Join the waitlist.",
  alternates: { canonical: "/paystub-maker" },
  openGraph: { url: "/paystub-maker" },
};

const USES = [
  {
    icon: <FileText size={20} />,
    title: "Proof of income",
    body: "A clear record of earnings for renting, lending, or applications that ask for one.",
  },
  {
    icon: <RefreshCcw size={20} />,
    title: "Replace a lost stub",
    body: "Recreate the details of a pay stub you no longer have a copy of.",
  },
  {
    icon: <Briefcase size={20} />,
    title: "Self-employed & contractors",
    body: "Freelancers and gig workers who need a tidy earnings statement of their own.",
  },
];

export default function PaystubMakerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "Create Pay Stub", path: "/paystub-maker" }])} />

      <div
        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider"
        style={{ background: "var(--teal)", color: "var(--teal-fg)" }}
      >
        Launching soon
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Pay stub generator</h1>
      <p className="text-lg text-muted leading-relaxed mb-10 max-w-2xl">
        We are building a simple pay stub generator - clean, professional, and honest. It is for
        legitimate uses like proving income, replacing a stub you have lost, or producing your
        own earnings statement when you are self-employed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {USES.map((u) => (
          <div key={u.title} className="card p-5">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded mb-3"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              {u.icon}
            </span>
            <h3 className="font-bold text-base mb-1.5">{u.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{u.body}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed mb-8">
        A pay stub generator is for accurate records of real income. It is not for
        misrepresenting earnings to anyone, and we will not build it for that.
      </p>

      <div className="max-w-2xl">
        <SubscribeForm source="paystub-maker" />
      </div>
    </div>
  );
}
