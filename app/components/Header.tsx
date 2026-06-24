"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bookmark, ChevronDown, Menu, X } from "lucide-react";
import { readSaved, subscribeSaved } from "../lib/saved";

const NAV = [
  { href: "/companies", label: "Employers" },
  { href: "/paystub-maker", label: "Create Pay Stub" },
  { href: "/faq", label: "FAQ" },
];

const MORE = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Live count for the Saved badge (updates on save/remove + cross-tab).
  useEffect(() => {
    const sync = () => setSavedCount(readSaved().length);
    sync();
    return subscribeSaved(sync);
  }, []);

  // Longest-prefix match: a sub-route (e.g. /bah/2026-changes) wins over its
  // parent (/bah), so exactly one nav item is marked active.
  const activeHref =
    [...NAV, ...MORE]
      .map((i) => i.href)
      .filter((h) => pathname === h || pathname.startsWith(h + "/"))
      .sort((a, b) => b.length - a.length)[0] ?? null;

  const moreActive = MORE.some((i) => i.href === activeHref);

  // Close every menu on route change.
  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!moreOpen && !mobileOpen) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (moreOpen && moreRef.current && !moreRef.current.contains(t)) setMoreOpen(false);
      if (mobileOpen && headerRef.current && !headerRef.current.contains(t)) setMobileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen, mobileOpen]);

  // Transparent border on inactive items keeps the row from shifting 1.5px
  // when the active pill's border appears.
  const linkCls = (href: string) =>
    href === activeHref
      ? "px-2 py-0.5 rounded-sm font-bold bg-[var(--accent)] text-[var(--accent-fg)] border-[1.5px] border-foreground"
      : "px-2 py-0.5 rounded-sm border-[1.5px] border-transparent hover:underline";

  const mobileItemCls = (href: string) =>
    href === activeHref
      ? "px-3 py-2.5 rounded-sm font-bold bg-[var(--accent)] text-[var(--accent-fg)] border-[1.5px] border-foreground"
      : "px-3 py-2.5 rounded-sm border-[1.5px] border-transparent hover:bg-foreground/5";

  const trigger = () => {
    const evt = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
    });
    window.dispatchEvent(evt);
  };

  return (
    <header
      ref={headerRef}
      className="border-b border-card-border bg-background sticky top-0 z-30"
    >
      {/* USWDS navy top stripe */}
      <div className="h-1 bg-[var(--accent)]" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md font-black text-base leading-none"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            P
          </span>
          <span>PayDocHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          {NAV.map((i) => (
            <Link key={i.href} href={i.href} className={linkCls(i.href)}>
              {i.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-0.5 cursor-pointer px-2 py-0.5 rounded-sm border-[1.5px] ${
                moreActive || moreOpen
                  ? "font-bold bg-[var(--accent)] text-[var(--accent-fg)] border-foreground"
                  : "border-transparent text-muted-2 hover:text-foreground"
              }`}
            >
              More
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 card p-2 flex flex-col gap-1.5 min-w-[11rem] z-30"
              >
                {MORE.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    role="menuitem"
                    onClick={() => setMoreOpen(false)}
                    className={
                      i.href === activeHref
                        ? "px-1.5 py-0.5 rounded-sm font-bold bg-[var(--accent)] text-[var(--accent-fg)]"
                        : "px-1.5 py-0.5 rounded-sm hover:underline"
                    }
                  >
                    {i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/saved"
            aria-label={`Saved results${savedCount ? ` (${savedCount})` : ""}`}
            title="Your saved results"
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-sm border-[1.5px] border-foreground ${
              pathname === "/saved" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-background"
            }`}
          >
            <Bookmark size={16} strokeWidth={2.5} className={savedCount > 0 ? "fill-current" : ""} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] border-[1.5px] border-foreground text-[10px] font-bold leading-none flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>
          <button
            onClick={trigger}
            className="btn btn-ghost text-sm flex items-center gap-2"
            aria-label="Open command palette"
          >
            <span className="hidden sm:inline text-muted">Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-sm border-[1.5px] border-foreground bg-background"
          >
            {mobileOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t-[1.5px] border-foreground bg-background">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-0.5 text-[15px]">
            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setMobileOpen(false)}
                className={mobileItemCls(i.href)}
              >
                {i.label}
              </Link>
            ))}
            <div className="h-px bg-foreground/15 my-1.5" />
            {MORE.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setMobileOpen(false)}
                className={mobileItemCls(i.href)}
              >
                {i.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
