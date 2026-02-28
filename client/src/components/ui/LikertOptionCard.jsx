import clsx from "clsx";
import { forwardRef } from "react";

const LikertOptionCard = forwardRef(function LikertOptionCard(
  { label, helperText, selected, disabled, onClick, onKeyDown, tabIndex },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-checked={selected}
      role="radio"
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={clsx(
        "flex min-h-[88px] w-full min-w-0 flex-col items-start justify-between gap-3 rounded-3xl border px-4 py-4 text-left text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:min-h-[132px]",
        selected
          ? "border-brand-300 bg-brand-50 text-brand-900 shadow-subtle"
          : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-brand-200 hover:bg-white",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={clsx(
          "inline-flex h-6 w-6 items-center justify-center rounded-full border transition",
          selected ? "border-brand-500 bg-brand-500" : "border-slate-300 bg-white"
        )}
        aria-hidden="true"
      >
        <span
          className={clsx(
            "h-2.5 w-2.5 rounded-full transition",
            selected ? "bg-white" : "bg-transparent"
          )}
        />
      </span>
      <span className="space-y-1">
        <span className="block leading-tight">{label}</span>
        {helperText ? (
          <span className="block text-xs font-medium leading-snug text-slate-500">{helperText}</span>
        ) : null}
      </span>
    </button>
  );
});

export default LikertOptionCard;
