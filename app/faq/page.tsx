import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { faq, faqJsonLd, totalFaqCount } from "../lib/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about PayDocHub - how to log in to your employee portal, find your pay stub, get your W-2, and how we handle privacy and email.",
  alternates: { canonical: "/faq" },
  openGraph: { url: "/faq" },
};

export default function FaqPage() {
  const jsonLd = faqJsonLd();
  const count = totalFaqCount();

  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <JsonLd data={breadcrumbs([{ name: "FAQ", path: "/faq" }])} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-base leading-relaxed text-foreground/80">
          {count} answers about portal logins, pay stubs, W-2 forms, and how we
          handle your data. Cannot find what you are looking for?{" "}
          <Link href="/contact" className="text-teal font-semibold underline">
            Send us a note
          </Link>
          .
        </p>
      </header>

      <nav className="mb-10 card p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Jump to
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
          {faq.map((c) => (
            <li key={c.slug}>
              <a href={`#${c.slug}`} className="hover:underline">
                {c.category}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {faq.map((category) => (
          <section key={category.slug} id={category.slug} className="scroll-mt-6">
            <h2 className="text-xl font-bold mb-4">{category.category}</h2>
            <div className="space-y-2">
              {category.items.map((item) => (
                <details key={item.q} className="faq-item card group">
                  <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none select-none font-medium text-base">
                    <ChevronRight
                      size={18}
                      className="faq-chevron flex-shrink-0 transition-transform duration-150"
                    />
                    <span className="flex-1">{item.q}</span>
                  </summary>
                  <div className="pl-4 pr-4 pb-4 text-sm leading-relaxed text-foreground/85">
                    <div className="pl-7 mt-2">{item.a}</div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-muted-2">
        <h2 className="text-xl font-bold mb-3">Still stuck?</h2>
        <p className="text-base leading-relaxed mb-4">
          If your question is not here, or you found a wrong rate, drop a note.
          Responses usually within 48 hours.
        </p>
        <Link href="/contact" className="btn btn-teal">
          Contact us <ChevronRight size={16} />
        </Link>
      </div>

      <style>{`
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] .faq-chevron { transform: rotate(90deg); }
        .faq-item[open] > summary { border-bottom: 1.5px solid var(--card-border); }
      `}</style>
    </article>
  );
}
