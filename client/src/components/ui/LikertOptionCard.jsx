import clsx from "clsx";

function LikertOptionCard({ label, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-checked={selected}
      role="radio"
      onClick={onClick}
      className={clsx(
        "flex h-[72px] w-full flex-col items-center justify-center gap-2 rounded-xl border text-xs font-medium transition",
        selected
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-line bg-white text-slate-500 hover:border-brand-200 hover:bg-brand-50/30",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={clsx(
          "inline-flex h-4 w-4 items-center justify-center rounded-full border",
          selected ? "border-brand-500" : "border-slate-300"
        )}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-brand-500" /> : null}
      </span>
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

export default LikertOptionCard;
