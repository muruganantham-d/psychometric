import clsx from "clsx";

const variantClasses = {
  muted: "border border-line bg-slate-50 text-slate-600",
  brand: "border border-brand-100 bg-brand-50 text-brand-700",
  dark: "border border-white/25 bg-white/10 text-white",
};

function Tag({ children, variant = "muted", className }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", variantClasses[variant], className)}>
      {children}
    </span>
  );
}

export default Tag;
