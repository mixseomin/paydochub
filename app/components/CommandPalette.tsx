"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight, Search, FileText, HelpCircle, Home, Info } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { EMPLOYERS } from "../lib/employers";

const PAGES = [
  { label: "Home", path: "/", icon: Home },
  { label: "Employers", path: "/companies", icon: Building2 },
  { label: "Create Pay Stub", path: "/paystub-maker", icon: FileText },
  { label: "FAQ", path: "/faq", icon: HelpCircle },
  { label: "About", path: "/about", icon: Info },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) trackEvent("command_palette", { action: "open" });
          return !v;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const go = (path: string) => {
    trackEvent("command_palette", { action: "select", item_id: path });
    setOpen(false);
    setSearch("");
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      style={{ background: "rgba(27, 27, 27, 0.4)" }}
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <Command label="Command Menu">
          <div className="flex items-center gap-2 pl-4">
            <Search size={18} className="text-muted" />
            <Command.Input
              autoFocus
              placeholder="Search an employer, or jump to a page..."
              value={search}
              onValueChange={setSearch}
            />
            <kbd className="mr-3">esc</kbd>
          </div>

          <Command.List>
            <Command.Empty>No matches. Try an employer name.</Command.Empty>

            <Command.Group heading="Pages">
              {PAGES.map((p) => {
                const Icon = p.icon;
                return (
                  <Command.Item key={p.path} value={p.label} onSelect={() => go(p.path)}>
                    <Icon size={16} />
                    <div className="flex-1 font-medium">{p.label}</div>
                    <ChevronRight size={14} />
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="Employers">
              {EMPLOYERS.map((e) => (
                <Command.Item key={e.slug} value={e.name} onSelect={() => go(`/${e.slug}`)}>
                  <Building2 size={16} />
                  <div className="flex-1">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted">Login, pay stub &amp; W-2</div>
                  </div>
                  <ChevronRight size={14} />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
