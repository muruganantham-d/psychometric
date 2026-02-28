import clsx from "clsx";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(null);

const toneClasses = {
  error: {
    shell: "border-rose-200 bg-white text-slate-900",
    icon: "bg-rose-100 text-rose-600",
  },
  success: {
    shell: "border-emerald-200 bg-white text-slate-900",
    icon: "bg-emerald-100 text-emerald-600",
  },
};

function ToastItem({ toast, onDismiss }) {
  const tone = toneClasses[toast.variant] || toneClasses.error;
  const Icon = toast.variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={clsx(
        "pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-start gap-3 rounded-3xl border p-4 shadow-card backdrop-blur-sm",
        tone.shell
      )}
      role="status"
      aria-live="polite"
    >
      <span className={clsx("mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", tone.icon)}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description ? (
          <p className="text-sm leading-relaxed text-slate-600">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "error", duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((currentToasts) => {
        const nextToasts = [...currentToasts, { id, title, description, variant }];
        return nextToasts.slice(-3);
      });

      window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  const contextValue = useMemo(
    () => ({
      toast,
      dismissToast,
    }),
    [toast, dismissToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-3 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0">
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
