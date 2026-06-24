"use client";

import { useEffect, useState } from "react";
import { Link2, MessageSquare, Share2, ImageDown, Check, Bookmark, BookmarkCheck } from "lucide-react";
import {
  ogImageUrl,
  shareText,
  sharePath,
  EMBEDDABLE_CALCS,
  type CalcId,
  type ShareCard,
  type ShareParams,
} from "../lib/share";
import { isSaved, toggleSaved } from "../lib/saved";
import { trackEvent, useTrackOnce } from "../lib/analytics";
import { EmbedButton } from "./EmbedButton";

type Props<C extends CalcId> = {
  /** Which calculator this result came from (drives the tweet/share text). */
  calc: C;
  /** The value-led share card built from the current result via buildShare.*. */
  card: ShareCard;
  /**
   * The user's CURRENT scenario - same values the calc holds in state, keys
   * matching what each component writes to the URL. ShareButtons feeds these
   * through sharePath() so every share carries a deep-link to THEIR exact
   * result (and the dynamic OG unfurls THEIR number), not a bare calculator.
   */
  params?: ShareParams[C];
  /**
   * Explicit canonical path override (e.g. a server-rendered "/bah/<slug>"
   * page that already knows its own URL). Wins over `params`. When neither is
   * given, falls back to the live URL.
   */
  pagePath?: string;
};

/**
 * Result-aware share strip. Every action carries the user's actual number and
 * the decision it drives, never "check out this calculator":
 *   - Copy link        -> canonical URL with result state
 *   - X / Facebook /    -> prefilled with shareText(card) (value-led headline)
 *     Reddit              + the canonical URL
 *   - Save image        -> fetches the result OG card, copies it to clipboard
 *                          (ClipboardItem), with a download fallback
 */
export function ShareButtons<C extends CalcId>({
  calc,
  card,
  params,
  pagePath,
}: Props<C>) {
  const [copied, setCopied] = useState(false);
  const [imgState, setImgState] = useState<"idle" | "working" | "copied" | "saved">("idle");

  // Fires once when this result-share strip mounts = the user reached a valid
  // result for `calc` (ShareButtons only renders when a result exists).
  useTrackOnce("calc_used", { item_id: calc }, true);

  // Resolve the deep-link the share points at, in priority order:
  //   1. explicit pagePath override (server-rendered canonical pages)
  //   2. sharePath(calc, params) - the user's exact scenario as a deep-link
  //   3. the live URL (last resort, before params are wired)
  const liveUrl = typeof window !== "undefined" ? window.location.href : "";
  const resolvedPath =
    pagePath ?? (params ? sharePath(calc, params) : undefined);
  const shareUrl = resolvedPath
    ? resolvedPath.startsWith("http")
      ? resolvedPath
      : `https://paydochub.com${resolvedPath.startsWith("/") ? "" : "/"}${resolvedPath}`
    : liveUrl;

  // Virality attribution: tag every shared link so inbound clicks are
  // distinguishable from typed/direct traffic in GA4. The copy-link channel
  // matters most - pasted into iMessage/WhatsApp/Discord it would otherwise land
  // as "direct" and the whole word-of-mouth loop would be invisible.
  const withSrc = (medium: string) => {
    const u = new URL(shareUrl || "https://paydochub.com");
    u.searchParams.set("utm_source", "share");
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", "viral");
    return u.toString();
  };

  // GA4 recommended `share` event = the numerator of the viral coefficient
  // (how many people actually tried to share, per channel, per calculator).
  const track = (method: string) =>
    trackEvent("share", { method, item_id: calc, content_type: "calc_result" });

  // Internal deep-link used as the stable id + restore target for "save".
  const savePath = (() => {
    if (resolvedPath && !resolvedPath.startsWith("http"))
      return resolvedPath.startsWith("/") ? resolvedPath : "/" + resolvedPath;
    try {
      const u = new URL(shareUrl || "https://paydochub.com");
      return u.pathname + u.search;
    } catch {
      return "/";
    }
  })();

  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isSaved(savePath)), [savePath]);

  const toggleSave = () => {
    const now = toggleSaved({
      id: savePath,
      calc,
      value: card.value,
      headline: card.headline,
      sub: card.sub,
      tag: card.tag,
      path: savePath,
      savedAt: Date.now(),
    });
    setSaved(now);
    trackEvent(now ? "save_result" : "unsave_result", { item_id: calc });
  };

  // Value-led copy for the social intents. shareText() already appends the URL,
  // so for X/Reddit we pass the headline as text and let the platform attach the
  // link separately (cleaner unfurl). For copy-to-clipboard fallback we use the
  // full shareText() string.
  const text = card.headline;
  const copyUrl = withSrc("copy");
  const fullShare = shareText(card, copyUrl);

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(withSrc("x"))}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withSrc("facebook"))}&quote=${encodeURIComponent(text)}`;
  const reddit = `https://www.reddit.com/submit?url=${encodeURIComponent(withSrc("reddit"))}&title=${encodeURIComponent(text)}`;

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(fullShare);
    } catch {
      await navigator.clipboard.writeText(copyUrl);
    }
    track("copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Fetch the result OG card and copy it to the clipboard as an image. Falls
  // back to a download when the browser blocks image clipboard writes (Safari,
  // Firefox, non-secure contexts).
  const saveImage = async () => {
    if (typeof window === "undefined") return;
    track("image");
    setImgState("working");
    try {
      const res = await fetch(ogImageUrl(card), { cache: "no-store" });
      const blob = await res.blob();

      const canWrite =
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        "write" in navigator.clipboard;

      if (canWrite) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type || "image/png"]: blob }),
          ]);
          setImgState("copied");
          setTimeout(() => setImgState("idle"), 1800);
          return;
        } catch {
          // fall through to download
        }
      }

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `paydochub-${calc}-${card.value
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setImgState("saved");
      setTimeout(() => setImgState("idle"), 1800);
    } catch {
      setImgState("idle");
    }
  };

  const imgLabel =
    imgState === "working"
      ? "Saving…"
      : imgState === "copied"
        ? "Image copied"
        : imgState === "saved"
          ? "Downloaded"
          : "Save image";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <button onClick={copyLink} className="btn" title="Copy a shareable link to this exact result">
        {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? "Copied" : "Copy link"}
      </button>
      <button
        onClick={toggleSave}
        className={`btn ${saved ? "btn-primary" : ""}`}
        title={saved ? "Saved on this device - open Saved (header) to view all" : "Save this result to view later (stored on this device, no sign-up)"}
      >
        {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />} {saved ? "Saved" : "Save"}
      </button>
      <a href={tw} onClick={() => track("x")} target="_blank" rel="noopener noreferrer" className="btn" title="Share this number on X">
        <Share2 size={14} /> X / Twitter
      </a>
      <a href={fb} onClick={() => track("facebook")} target="_blank" rel="noopener noreferrer" className="btn" title="Share this number on Facebook">
        <Share2 size={14} /> Facebook
      </a>
      <a href={reddit} onClick={() => track("reddit")} target="_blank" rel="noopener noreferrer" className="btn" title="Post this number to Reddit">
        <MessageSquare size={14} /> Reddit
      </a>
      <button
        onClick={saveImage}
        disabled={imgState === "working"}
        className="btn"
        title="Copy the result card image to your clipboard (downloads if your browser blocks it)"
      >
        {imgState === "copied" || imgState === "saved" ? (
          <Check size={14} />
        ) : (
          <ImageDown size={14} />
        )}{" "}
        {imgLabel}
      </button>
      {(EMBEDDABLE_CALCS as readonly string[]).includes(calc) && (
        <EmbedButton calc={calc} />
      )}
    </div>
  );
}
