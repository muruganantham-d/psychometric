import Card from "./ui/Card";
import LikertScale from "./ui/LikertScale";
import { PILLAR_LABELS } from "../utils/constants";
import { TRAIT_LABELS } from "../utils/traits";

function QuestionCard({ question, number, value, onChange, disabled }) {
  return (
    <Card className="space-y-6 p-5 sm:p-7">
      <div className="space-y-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-sm font-bold text-brand-700">
            {number}
          </span>
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {PILLAR_LABELS[question.pillar]} / {TRAIT_LABELS[question.traitKey] || question.traitKey}
            </p>
            <h3 className="text-lg font-semibold leading-relaxed text-ink sm:text-xl">{question.text}</h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-500">
          Choose the response that feels most accurate. Arrow keys move between options and number labels are shown on
          each choice.
        </p>
      </div>

      <LikertScale value={value} onChange={onChange} disabled={disabled} />
    </Card>
  );
}

export default QuestionCard;
