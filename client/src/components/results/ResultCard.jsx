import clsx from "clsx";
import Card from "../ui/Card";

function ResultCard({ children, className }) {
  return <Card className={clsx("rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm", className)}>{children}</Card>;
}

export default ResultCard;
