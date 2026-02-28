import clsx from "clsx";
import { DollarSign, GraduationCap, TrendingUp } from "lucide-react";
import Pill from "../ui/Pill";
import ResultCard from "./ResultCard";

function MetaItem({ icon, label, value, iconClassName }) {
  const IconComponent = icon;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
        <IconComponent size={16} strokeWidth={2} className={iconClassName} />
        <span>{label}</span>
      </div>
      <p className="text-sm leading-snug text-slate-600">{value}</p>
    </div>
  );
}

function CareerMatchCard({ career, highlight = false }) {
  return (
    <ResultCard
      className={clsx(
        "space-y-5 border py-5 sm:py-6",
        highlight
          ? "border-brand-300 ring-1 ring-brand-100"
          : "border-slate-200/70"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold leading-tight text-slate-900 md:text-[26px]">{career.title}</h3>
            <Pill className="bg-slate-100 text-[11px] text-slate-600">{career.category}</Pill>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{career.description}</p>
        </div>

        <div className="shrink-0 rounded-3xl bg-brand-50 px-4 py-3 text-left sm:min-w-[112px] sm:text-right">
          <p className="text-4xl font-semibold leading-none text-brand-700 md:text-[38px]">{career.matchScore}%</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Match</p>
        </div>
      </div>

      <div className="grid gap-4 border-y border-slate-200/70 py-4 md:grid-cols-3">
        <MetaItem icon={DollarSign} label="Salary Range" value={career.salaryRange} iconClassName="text-emerald-600" />
        <MetaItem icon={GraduationCap} label="Education" value={career.education} iconClassName="text-blue-600" />
        <MetaItem icon={TrendingUp} label="Growth Outlook" value={career.growthOutlook} iconClassName="text-brand-600" />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Why it fits you</p>
        <div className="flex flex-wrap gap-2">
          {career.whyItFits?.map((tag) => (
            <Pill key={tag} variant="accent">
              {tag}
            </Pill>
          ))}
        </div>
      </div>
    </ResultCard>
  );
}

export default CareerMatchCard;
