import clsx from "clsx";

const variantClasses = {
  primary:
    "border border-transparent bg-brand-600 text-white shadow-button hover:bg-brand-700 focus-visible:ring-brand-200 disabled:bg-brand-300",
  secondary:
    "border border-white/70 bg-white/90 text-ink shadow-subtle hover:bg-white focus-visible:ring-brand-100 disabled:bg-white/70 disabled:text-slate-400",
  outline:
    "border border-slate-300/90 bg-white/70 text-ink shadow-subtle hover:border-brand-200 hover:bg-white focus-visible:ring-brand-100 disabled:bg-white/60 disabled:text-slate-400",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:bg-white/70 focus-visible:ring-slate-200",
  light:
    "border border-white/15 bg-white text-ink shadow-subtle hover:bg-white/90 focus-visible:ring-white/40",
};

const sizeClasses = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
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
        "inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold leading-none transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70",
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
      <span className="inline-flex min-w-0 items-center justify-center gap-2 leading-none">{children}</span>
    </button>
  );
}

export default Button;
