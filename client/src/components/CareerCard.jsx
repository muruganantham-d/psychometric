import Card from "./ui/Card";
import Tag from "./ui/Tag";
import { toPercent } from "../utils/formatters";

function CareerCard({ career }) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-ink">{career.title}</h3>
          <p className="text-sm text-slate-500">{career.category}</p>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
          {toPercent(career.matchScore)}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{career.description}</p>

      <div className="space-y-1.5 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-ink">Salary Range:</span> {career.salaryRange}
        </p>
        <p>
          <span className="font-semibold text-ink">Education:</span> {career.education}
        </p>
        <p>
          <span className="font-semibold text-ink">Growth Outlook:</span> {career.growthOutlook}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">Why it fits you</p>
        <div className="flex flex-wrap gap-2">
          {career.whyItFits?.map((tag) => (
            <Tag key={tag} variant="brand">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default CareerCard;
