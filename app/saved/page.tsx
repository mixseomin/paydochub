import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { SavedList } from "@/app/components/SavedList";

// Per-device, user-specific page - nothing for search engines to index.
export const metadata: Metadata = {
  title: "Saved - PayDocHub",
  description: "Your saved employer pages, stored on this device.",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <header className="mb-8 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal mb-2 flex items-center gap-1.5">
          <Bookmark size={13} /> Saved
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your saved pages</h1>
        <p className="text-base leading-relaxed text-foreground/80">
          Employer pages you bookmarked, kept on this device. No account, no cloud - clear your
          browser storage and they are gone. Tap any card to reopen it.
        </p>
      </header>

      <SavedList />
    </div>
  );
}
