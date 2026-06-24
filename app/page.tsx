import Link from "next/link";
import { ArrowRight, Search, FileText, KeyRound } from "lucide-react";
import { SubscribeForm } from "./components/SubscribeForm";
import { EmployerSearch } from "./components/EmployerSearch";
import { EMPLOYERS } from "./lib/employers";

const STEPS = [
  {
    icon: <Search size={20} />,
    title: "Find your employer",
    body: "Search or browse our directory of US employers to open the right page in one click.",
  },
  {
    icon: <KeyRound size={20} />,
    title: "Login, pay stub & W-2",
    body: "Each page walks you through the employee portal login, where to find pay stubs, and how to get your W-2.",
  },
  {
    icon: <FileText size={20} />,
    title: "Create a stub if you need one",
    body: "Lost a pay stub or self-employed? Generate a clean, professional pay stub in minutes.",
  },
];

export default function Home() {
  const popular = EMPLOYERS.slice(0, 12);
  const searchData = EMPLOYERS.map((e) => ({ name: e.name, slug: e.slug }));

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider"
            style={{ background: "var(--teal)", color: "var(--teal-fg)" }}
          >
            <span>US employers</span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--teal-fg)" }} />
            <span>Free · No login</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.98] mb-6">
            Find your employer&apos;s
            <br />
            <span style={{ color: "var(--accent)" }}>pay docs.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl leading-relaxed">
            Employee portal login, pay stub access, and W-2 instructions for any US employer.
            No account, no funnel - just the steps you came for.
          </p>
          <div className="mb-5">
            <EmployerSearch employers={searchData} />
          </div>
          <Link href="/companies" className="btn inline-flex items-center gap-1.5">
            Browse all employers <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Popular employers */}
      <section className="pb-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Popular employers
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.map((e) => (
            <Link
              key={e.slug}
              href={`/${e.slug}`}
              className="card p-4 block hover:border-accent transition-colors"
            >
              <div className="font-semibold">{e.name}</div>
              <div className="text-xs text-muted mt-0.5">Login, pay stub &amp; W-2</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-16">
        {STEPS.map((s) => (
          <div key={s.title} className="card p-6">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded mb-3"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              {s.icon}
            </span>
            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      {/* Pay stub CTA */}
      <section className="pb-16">
        <div className="card p-8 flex items-center justify-between gap-6 flex-wrap" style={{ background: "var(--teal)", color: "var(--teal-fg)" }}>
          <div>
            <h2 className="text-2xl font-bold mb-1">Need a pay stub now?</h2>
            <p className="text-sm opacity-90 max-w-xl">
              Create a professional pay stub in minutes - for proof of income, a replacement
              for a lost stub, or self-employed and contract work.
            </p>
          </div>
          <Link href="/paystub-maker" className="btn bg-white text-foreground font-semibold inline-flex items-center gap-1.5 shrink-0">
            Create a pay stub <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="pt-2 pb-14">
        <div className="max-w-2xl mx-auto">
          <SubscribeForm source="home-footer" />
        </div>
      </section>
    </div>
  );
}
