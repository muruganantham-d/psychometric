import { TrendingUp } from "lucide-react";

function ResultHeader() {
  return (
    <header className="space-y-3 text-center">
      <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/90">
        <TrendingUp size={16} strokeWidth={2} className="text-emerald-600" />
      </span>

      <div className="space-y-1.5">
        <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Your Career Blueprint
        </h1>
        <p className="mx-auto max-w-[560px] text-sm leading-relaxed text-slate-500">
          Based on your responses, we&apos;ve analyzed your personality and interests to find these optimal career
          paths.
        </p>
      </div>
    </header>
  );
}

export default ResultHeader;
