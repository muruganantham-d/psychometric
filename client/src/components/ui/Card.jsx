import clsx from "clsx";

function Card({ children, className }) {
  return <div className={clsx("rounded-2xl border border-slate-200/70 bg-white shadow-sm", className)}>{children}</div>;
}

export default Card;
