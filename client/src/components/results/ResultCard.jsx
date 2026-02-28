import clsx from "clsx";
import Card from "../ui/Card";

function ResultCard({ children, className }) {
  return (
    <Card className={clsx("rounded-[28px] border border-white/80 bg-white/90 p-5 sm:p-6", className)}>
      {children}
    </Card>
  );
}

export default ResultCard;
