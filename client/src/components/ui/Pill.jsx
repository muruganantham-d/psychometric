import clsx from "clsx";

const variantClasses = {
  neutral: "border border-slate-200/70 bg-slate-100/80 text-slate-700",
  accent: "border border-brand-200 bg-brand-50 text-brand-700",
};

function Pill({ children, className, variant = "neutral" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Pill;
