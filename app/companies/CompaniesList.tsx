"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Item = { name: string; slug: string; popular: boolean };

export function CompaniesList({ employers }: { employers: Item[] }) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return employers;
    return employers.filter((e) => e.name.toLowerCase().includes(t));
  }, [q, employers]);

  return (
    <div>
      <div className="flex items-center gap-2 input max-w-md mb-6">
        <Search size={18} className="text-muted shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter employers"
          className="flex-1 bg-transparent outline-none"
          autoComplete="off"
          aria-label="Filter employers"
        />
      </div>

      {list.length === 0 ? (
        <p className="text-muted text-sm">No employers match &quot;{q}&quot;.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {list.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/${e.slug}`}
                className="flex items-center justify-between gap-2 card px-4 py-3 hover:border-accent transition-colors"
              >
                <span className="font-medium">{e.name}</span>
                {e.popular && (
                  <span className="mono text-[10px] uppercase tracking-wider text-teal font-semibold shrink-0">
                    Popular
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
