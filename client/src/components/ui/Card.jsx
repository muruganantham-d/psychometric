import clsx from "clsx";

function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "rounded-[28px] border border-white/70 bg-white/90 shadow-card backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
