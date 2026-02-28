function InsightText({ children }) {
  return (
    <p className="rounded-2xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-xs leading-relaxed text-slate-600">
      <span className="font-semibold text-slate-800">Insight:</span> {children}
    </p>
  );
}

export default InsightText;
