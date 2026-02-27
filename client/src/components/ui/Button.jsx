import clsx from "clsx";

const variantClasses = {
  primary: "border border-transparent bg-brand-500 text-white shadow-button hover:bg-brand-600 focus-visible:ring-brand-200 disabled:bg-brand-300",
  secondary: "border border-slate-200 bg-white text-ink hover:bg-slate-50 focus-visible:ring-brand-100 disabled:text-slate-400 disabled:bg-slate-100",
  outline: "border border-slate-200 bg-white text-ink hover:bg-slate-50 focus-visible:ring-brand-100 disabled:text-slate-400 disabled:bg-slate-100",
  ghost: "border border-transparent bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200",
  light: "border border-white/20 bg-white text-ink hover:bg-slate-100 focus-visible:ring-white/40",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
