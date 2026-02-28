import { TOTAL_STEPS } from "../../utils/constants";

function ProgressBar({ currentStep }) {
  const percentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{percentage}% complete</p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-11 gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <span
            key={index}
            className={
              index + 1 <= currentStep
                ? "h-1.5 rounded-full bg-brand-500"
                : "h-1.5 rounded-full bg-slate-200/90"
            }
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;
