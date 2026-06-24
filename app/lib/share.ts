/**
 * Share + OG engine for PayDocHub.
 *
 * Every shared calculator link unfurls with the user's RESULT (a real number)
 * plus a value / decision headline - never "what the tool does". Three consumers:
 *   - sharePath/shareUrl(calc, params) -> deep-link carrying the exact scenario
 *   - ogImageUrl(card)                 -> absolute /api/og URL for og:image
 *   - shareText(card, path)            -> value-led one-liner + URL for X/Reddit/FB
 *
 * Civilian only - the four live calculators: rmd, social-security,
 * capital-gains, child-tax-credit.
 */

export const SITE = "https://paydochub.com";

/** Calculator ids that have a headline builder. */
export type CalcId = "rmd" | "social-security" | "capital-gains" | "child-tax-credit";

/** Calc slugs with an /embed/<calc> route. None ship today. */
export const EMBEDDABLE_CALCS = [] as const;
export type EmbeddableCalc = (typeof EMBEDDABLE_CALCS)[number];

/** The four pieces every share card renders. */
export type ShareCard = {
  value: string;
  headline: string;
  sub: string;
  tag: string;
};

export type OgParams = ShareCard;

// ---------------------------------------------------------------------------
// formatting helpers
// ---------------------------------------------------------------------------

function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/** Compact dollars for big numbers: $312,400 -> "$312K", $1.2M -> "$1.2M". */
function usdCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 10_000) return `$${Math.round(n / 1000)}K`;
  return usd(n);
}

function perMo(n: number): string {
  return `${usd(n)}/mo`;
}

/** Deterministic index into a template list, seeded by the result values. */
function pick<T>(templates: T[], seed: number): T {
  const s = Math.abs(Math.round(seed));
  return templates[s % templates.length];
}

// ---------------------------------------------------------------------------
// per-calc headline builders
// ---------------------------------------------------------------------------

export const buildShare = {
  /** RMD: required withdrawal for an age + prior year-end balance. */
  rmd(args: { rmd: number; age: number; balance: number; required: boolean }): ShareCard {
    if (!args.required) {
      return {
        value: "$0",
        headline: `No RMD is required yet at age ${args.age}. Under SECURE 2.0 they start at 73 or 75.`,
        sub: "Required minimum distribution",
        tag: "RMD 2026",
      };
    }
    const amt = usd(args.rmd);
    const bal = usdCompact(args.balance);
    const templates = [
      `At age ${args.age} the IRS makes you pull at least ${amt} from a ${bal} retirement account this year. Take it by Dec 31 or face a 25% penalty.`,
      `Your ${args.age} required minimum distribution on ${bal} is ${amt}. Miss the deadline and the excise tax is 25% of the shortfall.`,
      `${amt} is the least you must withdraw this year at age ${args.age} (balance ${bal}). The required share climbs every year after.`,
    ];
    return {
      value: amt,
      headline: pick(templates, Math.round(args.rmd) + args.age),
      sub: `Age ${args.age}, Uniform Lifetime Table, 2026`,
      tag: "RMD 2026",
    };
  },

  /** Capital gains: total 2026 tax on the entered gains. */
  "capital-gains"(args: {
    filingLabel: string;
    totalTax: number;
    effectiveRate: number;
  }): ShareCard {
    const tax = usd(args.totalTax);
    const rate = `${args.effectiveRate.toFixed(1)}%`;
    const templates = [
      `Your 2026 capital gains tax comes to ${tax} - ${rate} effective on the gains. Long-term rates stack on top of your ordinary income, so the bracket matters.`,
      `${tax} in 2026 capital gains tax at a ${rate} effective rate. Held over a year? The 0/15/20% long-term rates plus the 3.8% NIIT decide the bill.`,
      `Selling this year means roughly ${tax} in capital gains tax (${rate} effective). A primary-home sale can exclude up to $250K/$500K under Section 121.`,
    ];
    return {
      value: tax,
      headline: pick(templates, Math.round(args.totalTax)),
      sub: `${args.filingLabel}, ${rate} effective on gains, 2026`,
      tag: "CAPITAL GAINS 2026",
    };
  },

  /** Child Tax Credit + EITC: total 2026 family benefit. */
  "child-tax-credit"(args: { total: number; children: number }): ShareCard {
    const total = usd(args.total);
    const kids = args.children === 1 ? "1 kid" : `${args.children} kids`;
    const templates = [
      `Your 2026 Child Tax Credit + EITC comes to ${total} with ${kids}. The refundable ACTC means part of it can come back even if you owe no tax.`,
      `${total} in 2026 family credits with ${kids}. CTC phases out at higher income, while the EITC rewards earned income up to a cap - both are in the number.`,
      `With ${kids}, your 2026 CTC + refundable ACTC + EITC totals ${total}. Filing status and earned income move it more than anything else.`,
    ];
    return {
      value: usdCompact(args.total),
      headline: pick(templates, Math.round(args.total) + args.children),
      sub: `2026 CTC + refundable ACTC + EITC, ${kids}`,
      tag: "CHILD TAX CREDIT 2026",
    };
  },

  /** Social Security: monthly retirement benefit at the chosen claim age. */
  "social-security"(args: { monthly: number; claimAge: number; fraLabel: string }): ShareCard {
    const mo = perMo(args.monthly);
    const yr = usd(args.monthly * 12);
    const templates = [
      `Claiming Social Security at ${args.claimAge} projects to ${mo} - ${yr}/yr. Your Full Retirement Age is ${args.fraLabel}; waiting longer raises the check.`,
      `${mo} a month at claim age ${args.claimAge}, ${yr}/yr. Claim before FRA (${args.fraLabel}) and it is cut for life; wait past it and you earn ~8% a year to 70.`,
      `At claim age ${args.claimAge} your benefit lands near ${mo} (${yr}/yr). The gap between 62 and 70 can be more than 70% of the monthly amount.`,
    ];
    return {
      value: mo,
      headline: pick(templates, Math.round(args.monthly) + args.claimAge),
      sub: `Claim at ${args.claimAge}, FRA ${args.fraLabel}`,
      tag: "SOCIAL SECURITY",
    };
  },
};

// ---------------------------------------------------------------------------
// OG image URL + social prefill text
// ---------------------------------------------------------------------------

/** Absolute /api/og URL for a share card. */
export function ogImageUrl(params: OgParams): string {
  const q = new URLSearchParams({
    headline: params.headline,
    value: params.value,
    sub: params.sub,
    tag: params.tag,
  });
  return `${SITE}/api/og?${q.toString()}`;
}

/** Value-led one-liner (headline + canonical URL) for X / Reddit / Facebook. */
export function shareText(card: ShareCard, pagePath: string): string {
  const url = pagePath.startsWith("http")
    ? pagePath
    : `${SITE}${pagePath.startsWith("/") ? "" : "/"}${pagePath}`;
  return `${card.headline}\n\n${url}`;
}

// ---------------------------------------------------------------------------
// param-aware deep-link URL builder
// ---------------------------------------------------------------------------

/**
 * Per-calc scenario params. Keys mirror exactly what each calc component writes
 * to the URL via url.set(...), so a shared link reopens the same result.
 */
export type ShareParams = {
  rmd: { age?: string | number; balance?: string | number };
  "capital-gains": {
    fs?: string;
    inc?: string | number;
    lt?: string | number;
    st?: string | number;
    magi?: string | number;
    home?: string;
    hg?: string | number;
  };
  "child-tax-credit": {
    filing?: string;
    kids?: string | number;
    od?: string | number;
    earned?: string | number;
    agi?: string | number;
    tax?: string | number;
    inv?: string | number;
  };
  "social-security": {
    birthYear?: string | number;
    aime?: string | number;
    claimAge?: string | number;
  };
};

/** Append only the defined params to a query string. */
function qs(entries: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(entries)) {
    if (v !== undefined && v !== "") q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function shareUrl<C extends keyof ShareParams>(calc: C, params: ShareParams[C]): string {
  return `${SITE}${sharePath(calc, params)}`;
}

/** Relative deep-link a component passes to ShareButtons. */
export function sharePath<C extends keyof ShareParams>(calc: C, params: ShareParams[C]): string {
  const s = (n: string | number | undefined) => (n === undefined ? undefined : String(n));
  switch (calc) {
    case "rmd": {
      const p = params as ShareParams["rmd"];
      return `/rmd${qs({ age: s(p.age), bal: s(p.balance) })}`;
    }
    case "capital-gains": {
      const p = params as ShareParams["capital-gains"];
      return `/capital-gains${qs({
        fs: p.fs,
        inc: s(p.inc),
        lt: s(p.lt),
        st: s(p.st),
        magi: s(p.magi),
        home: p.home,
        hg: s(p.hg),
      })}`;
    }
    case "child-tax-credit": {
      const p = params as ShareParams["child-tax-credit"];
      return `/child-tax-credit${qs({
        f: p.filing,
        kids: s(p.kids),
        od: s(p.od),
        earned: s(p.earned),
        agi: s(p.agi),
        tax: s(p.tax),
        inv: s(p.inv),
      })}`;
    }
    case "social-security": {
      const p = params as ShareParams["social-security"];
      return `/social-security${qs({
        by: s(p.birthYear),
        aime: s(p.aime),
        age: s(p.claimAge),
      })}`;
    }
    default: {
      const _never: never = calc;
      return `/${String(_never)}`;
    }
  }
}
