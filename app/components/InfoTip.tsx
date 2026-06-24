/**
 * InfoTip - a small "i" marker that reveals a plain-English explanation on
 * hover (desktop), focus (keyboard), or tap (mobile). Pure CSS group-hover +
 * focus-within, so it is instant (no native-title delay) and needs no client
 * state. Drop it right after any field label or result term:
 *
 *   <label ...>AGI $<InfoTip text="Adjusted Gross Income ..." /></label>
 */
export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-block align-middle ml-1 leading-none">
      <button
        type="button"
        aria-label="What is this?"
        className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full border border-foreground/40 text-muted text-[9px] font-bold leading-none cursor-help hover:border-foreground hover:text-foreground focus:outline-none focus:border-foreground focus:text-foreground"
      >
        i
      </button>
      <span
        role="tooltip"
        className="invisible group-hover:visible group-focus-within:visible absolute left-0 top-full mt-1.5 z-50 w-60 max-w-[78vw] card p-2.5 text-[11px] leading-snug normal-case tracking-normal font-normal text-foreground shadow-lg"
      >
        {text}
      </span>
    </span>
  );
}
