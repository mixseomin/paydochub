// Client-side "save for later" store. No login, no backend - results live in
// localStorage on the user's device, matching the tool's no-sign-up promise.
// Each saved item is a deep-link to the exact scenario, so opening it restores
// the calculator state.

const KEY = "mc:saved";
const CHANGED = "mc:saved-changed";

export type SavedItem = {
  id: string; // = path, unique per scenario
  calc: string;
  value: string; // the headline number ("$3,159/mo")
  headline: string; // value-led decision line
  sub: string; // supporting context
  tag: string; // short uppercase pill ("BAH 2026")
  path: string; // internal deep-link to restore the result
  savedAt: number;
};

export function readSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as SavedItem[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(items: SavedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CHANGED));
  } catch {
    /* quota or privacy mode - silently ignore */
  }
}

export function isSaved(id: string): boolean {
  return readSaved().some((i) => i.id === id);
}

/** Toggle save state for an item. Returns true if it is now saved. */
export function toggleSaved(item: SavedItem): boolean {
  const items = readSaved();
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items.splice(idx, 1);
    write(items);
    return false;
  }
  // newest first
  write([item, ...items]);
  return true;
}

export function removeSaved(id: string) {
  write(readSaved().filter((i) => i.id !== id));
}

export function clearSaved() {
  write([]);
}

/** Subscribe to changes (same-tab via custom event, cross-tab via storage). */
export function subscribeSaved(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) cb();
  };
  window.addEventListener(CHANGED, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGED, cb);
    window.removeEventListener("storage", onStorage);
  };
}
