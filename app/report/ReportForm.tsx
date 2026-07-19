"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function ReportForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const mounted = useRef(0);
  useEffect(() => {
    mounted.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErr("");
    const f = new FormData(e.currentTarget);
    const payload = {
      brand: f.get("brand"),
      url: f.get("url"),
      email: f.get("email"),
      role: f.get("role"),
      details: f.get("details"),
      captcha: f.get("captcha"),
      website: f.get("website"), // honeypot
      t: mounted.current,
    };
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("done");
        return;
      }
      const j = await res.json().catch(() => ({}));
      setErr(
        j.error === "captcha"
          ? "The verification answer was incorrect."
          : j.error === "rate limited"
            ? "Too many requests. Please try again later."
            : "Please fill in the brand, your email, and the page URL or details.",
      );
      setState("error");
    } catch {
      setErr("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-6 flex items-start gap-3">
        <ShieldCheck size={22} className="shrink-0 mt-0.5 text-teal" />
        <div>
          <div className="font-bold text-lg mb-1">Request received</div>
          <p className="text-sm leading-relaxed text-foreground/85">
            Thank you. We take brand and trademark concerns seriously. Your request has been logged
            and a verified brand-removal request is actioned <strong>within 24 hours</strong>. If
            you are the brand owner or an authorized representative, there is no need to escalate
            elsewhere - we will take the page down.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Brand / company name *</label>
        <input name="brand" required className="input w-full" autoComplete="off" placeholder="e.g. Example Corp" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Page URL on paydochub.com</label>
        <input name="url" type="url" className="input w-full" autoComplete="off" placeholder="https://paydochub.com/..." />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Your email *</label>
        <input name="email" type="email" required className="input w-full" autoComplete="off" placeholder="you@company.com" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Your role</label>
        <select name="role" className="input w-full" defaultValue="">
          <option value="" disabled>Select one</option>
          <option>Brand owner / trademark holder</option>
          <option>Authorized representative / agent</option>
          <option>Employee of the company</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Details</label>
        <textarea name="details" rows={4} className="input w-full" placeholder="Which content or trademark is at issue, and what you'd like removed." />
      </div>
      {/* honeypot: hidden from humans, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label className="block text-sm font-semibold mb-1">Verification: what is 3 + 4? *</label>
        <input name="captcha" required inputMode="numeric" className="input w-full max-w-[8rem]" autoComplete="off" placeholder="answer" />
      </div>
      <button type="submit" disabled={state === "sending"} className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Submit request"} <ArrowRight size={15} />
      </button>
      {state === "error" && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
