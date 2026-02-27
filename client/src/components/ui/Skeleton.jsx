import clsx from "clsx";

function Skeleton({ className }) {
  return <div className={clsx("skeleton animate-shimmer rounded-xl", className)} aria-hidden="true" />;
}

export default Skeleton;
