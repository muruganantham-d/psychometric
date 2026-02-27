import clsx from "clsx";

const variantClasses = {
  neutral: "border border-slate-200/70 bg-slate-100 text-slate-600",
  accent: "border border-indigo-200 bg-indigo-50 text-indigo-700",
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
