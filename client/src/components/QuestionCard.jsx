import Card from "./ui/Card";
import LikertScale from "./ui/LikertScale";
import { PILLAR_LABELS } from "../utils/constants";
import { TRAIT_LABELS } from "../utils/traits";

function QuestionCard({ question, number, value, onChange, disabled }) {
  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
            {number}
          </span>
          <h3 className="text-[19px] font-semibold leading-relaxed text-ink">{question.text}</h3>
        </div>

        <p className="pl-10 text-sm font-medium text-slate-500">
          {PILLAR_LABELS[question.pillar]} • {TRAIT_LABELS[question.traitKey] || question.traitKey}
        </p>
      </div>

      <LikertScale value={value} onChange={onChange} disabled={disabled} />
    </Card>
  );
}

export default QuestionCard;
