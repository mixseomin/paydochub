"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Trash2, X } from "lucide-react";
import { readSaved, removeSaved, clearSaved, subscribeSaved, type SavedItem } from "../lib/saved";

export function SavedList() {
  const [items, setItems] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(readSaved());
    sync();
    return subscribeSaved(sync);
  }, []);

  // null = not yet hydrated (avoid flashing the empty state during SSR/first paint)
  if (items === null) return null;

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Bookmark size={28} className="mx-auto mb-3 text-muted-2" />
        <h2 className="font-bold text-lg mb-1">No saved results yet</h2>
        <p className="text-muted text-sm mb-4">
          Run any calculator and hit <strong className="text-foreground">Save</strong> to keep a result here.
          Saved results live on this device - no sign-up, nothing leaves your browser.
        </p>
        <Link href="/" className="btn btn-primary">Browse calculators</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} saved {items.length === 1 ? "result" : "results"} on this device</p>
        <button onClick={clearSaved} className="btn text-xs flex items-center gap-1.5" title="Remove all saved results from this device">
          <Trash2 size={13} /> Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.id} className="card p-4 relative group">
            <button
              onClick={() => removeSaved(it.id)}
              className="absolute top-2 right-2 p-1 rounded-sm text-muted-2 hover:text-foreground hover:bg-foreground/5"
              title="Remove this saved result"
              aria-label="Remove"
            >
              <X size={15} />
            </button>
            <Link href={it.path} className="block">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-2 mb-1">{it.tag}</div>
              <div className="mono text-2xl font-bold tabular leading-none mb-1.5">{it.value}</div>
              <div className="text-sm font-medium leading-snug mb-1 pr-6">{it.headline}</div>
              <div className="text-xs text-muted">{it.sub}</div>
              <div className="text-[11px] text-muted-2 mt-2">
                Saved {new Date(it.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · tap to reopen
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
