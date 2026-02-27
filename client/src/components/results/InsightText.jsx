function InsightText({ children }) {
  return (
    <p className="rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
      <span className="font-medium text-slate-700">Insight:</span> {children}
    </p>
  );
}

export default InsightText;
