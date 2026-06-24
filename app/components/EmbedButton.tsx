"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Copy, Check } from "lucide-react";

// EMBEDDABLE_CALCS lives in the non-client lib/share so the server-rendered
// /embed route can map over it. Re-exported here for existing importers.
export { EMBEDDABLE_CALCS, type EmbeddableCalc } from "../lib/share";

type Props = {
  calc: string;
  compact?: boolean;
  /** Noun shown in the UI, e.g. "calculator" (default) or "map". */
  label?: string;
  /** Iframe height in px (maps are wider/shorter than calculators). */
  height?: number;
};

const ORIGIN = "https://paydochub.com";

export function EmbedButton({ calc, compact = false, label = "calculator", height = 520 }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const src = `${ORIGIN}/embed/${calc}`;
  const snippet = `<iframe src="${src}" width="100%" height="${height}" style="border:1.5px solid #1D1F27;border-radius:8px" loading="lazy" title="PayDocHub ${calc}"></iframe>`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={compact ? "btn btn-ghost p-1" : "btn"}
        style={
          compact
            ? { background: "transparent", border: "none", boxShadow: "none", minHeight: "auto" }
            : undefined
        }
        aria-expanded={open}
        title={`Embed this ${label} on your site`}
      >
        <Code2 size={compact ? 12 : 14} /> Embed
      </button>

      {open && (
        <div
          className="card p-4 absolute left-0 z-30 mt-2 w-[min(92vw,420px)] text-left"
          style={{ boxShadow: "6px 6px 0 var(--card-border)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-teal mb-2">
            Embed this {label}
          </div>
          <textarea
            readOnly
            value={snippet}
            onFocus={(e) => e.currentTarget.select()}
            rows={4}
            className="input mono w-full text-[11px] leading-snug resize-none"
            spellCheck={false}
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted">
              Free to embed - links back to paydochub.com
            </span>
            <button onClick={copy} className="btn btn-primary text-xs whitespace-nowrap">
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
