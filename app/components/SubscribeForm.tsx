"use client";

import { useEffect, useState } from "react";
import { Mail, Check } from "lucide-react";
import { trackEvent } from "../lib/analytics";

type Props = {
  source: string;
  zipHint?: string;
  variant?: "inline" | "card";
  /** Pre-check the monthly-newsletter opt-in (used by the /newsletter opt-up page). */
  newsletterDefault?: boolean;
};

export function SubscribeForm({ source, zipHint, variant = "card", newsletterDefault }: Props) {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState(zipHint ?? "");
  const [newsletter, setNewsletter] = useState(newsletterDefault ?? false);
  const [website, setWebsite] = useState(""); // honeypot
  const [ts, setTs] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setTs(Date.now());
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zip, source, website, ts, newsletter }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrMsg(data.error || "Subscribe failed");
        return;
      }
      setStatus("done");
      trackEvent("subscribe", { source, newsletter });
    } catch {
      setStatus("error");
      setErrMsg("Network error");
    }
  };

  if (status === "done") {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${variant === "card" ? "card p-4" : ""}`}
        style={variant === "card" ? { background: "var(--teal)", color: "var(--teal-fg)" } : undefined}
      >
        <Check size={16} className="shrink-0" />
        <span>
          You&apos;re on the list. We&apos;ll email you when the pay stub generator launches.
        </span>
      </div>
    );
  }

  const wrapClass = variant === "card" ? "card p-4" : "";

  return (
    <form onSubmit={submit} className={wrapClass}>
      <div className="flex items-center gap-2 mb-2">
        <Mail size={16} />
        <h3 className="font-bold text-sm">Get notified when the pay stub generator launches</h3>
      </div>
      <p className="text-xs text-muted mb-3">
        One email when it goes live, plus new tools as they ship. No spam, unsubscribe one click.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input flex-1"
          disabled={status === "sending"}
          autoComplete="email"
        />
        <input
          type="text"
          inputMode="numeric"
          placeholder="ZIP (optional)"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="input mono sm:max-w-[140px]"
          disabled={status === "sending"}
          autoComplete="postal-code"
        />
        <button
          type="submit"
          className="btn btn-primary shrink-0"
          disabled={status === "sending"}
        >
          {status === "sending" ? "..." : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 mt-3 text-xs text-muted cursor-pointer select-none">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          disabled={status === "sending"}
          className="w-4 h-4 mt-0.5 shrink-0"
        />
        <span>
          Also send me the <strong className="text-foreground">PayDocHub newsletter - new employer guides and tips</strong>. The launch alert above stays a one-off either way.
        </span>
      </label>

      {/* Honeypot: hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
        aria-hidden="true"
      />
      {status === "error" && (
        <div className="text-xs mt-2" style={{ color: "var(--warn)" }}>
          {errMsg}
        </div>
      )}
    </form>
  );
}
