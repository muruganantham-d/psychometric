import { Sparkles, TrendingUp } from "lucide-react";

function ResultHeader() {
  return (
    <header className="rounded-[32px] border border-white/70 bg-white/85 p-6 text-center shadow-card backdrop-blur-sm sm:p-8">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
        <TrendingUp size={20} strokeWidth={2} className="text-brand-700" />
      </span>

      <div className="mt-4 space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Sparkles size={14} strokeWidth={2} className="text-brand-600" />
          Premium results snapshot
        </span>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Your Career Blueprint
        </h1>
        <p className="mx-auto max-w-[640px] text-sm leading-relaxed text-slate-500 sm:text-base">
          Your profile is translated into career-fit signals, strengths, values, and next-fit roles so you can act on
          the results immediately.
        </p>
      </div>
    </header>
  );
}

export default ResultHeader;
