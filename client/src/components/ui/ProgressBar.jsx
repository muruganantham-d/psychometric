import { TOTAL_STEPS } from "../../utils/constants";

function ProgressBar({ currentStep }) {
  const percentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Step {currentStep} of {TOTAL_STEPS}</p>
        <p className="text-sm font-semibold text-brand-600">{percentage}%</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default ProgressBar;
