"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Employer } from "../lib/employers";

type Item = Pick<Employer, "name" | "slug">;

export function EmployerSearch({ employers }: { employers: Item[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return employers.filter((e) => e.name.toLowerCase().includes(t)).slice(0, 8);
  }, [q, employers]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches[0]) router.push(`/${matches[0].slug}`);
  };

  return (
    <div className="relative max-w-xl">
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2 input">
          <Search size={18} className="text-muted shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your employer (e.g. Best Buy, Hobby Lobby)"
            className="flex-1 bg-transparent outline-none"
            autoComplete="off"
            aria-label="Search employers"
          />
        </div>
      </form>
      {matches.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 card p-2 flex flex-col gap-0.5 z-20">
          {matches.map((m) => (
            <Link
              key={m.slug}
              href={`/${m.slug}`}
              className="px-3 py-2 rounded-sm hover:bg-foreground/5 text-sm font-medium"
            >
              {m.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
