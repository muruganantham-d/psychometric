import clsx from "clsx";

function Skeleton({ className }) {
  return (
    <div
      className={clsx("skeleton animate-shimmer rounded-2xl border border-white/60", className)}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
