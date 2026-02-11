import type { AnalysisResult } from "@/types/analysis";

type ResultPanelProps = {
  result: AnalysisResult;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Analysis results">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">Results</h2>
        <div className="flex items-center gap-2">
          <Pill>Confidence: {result.confidence}</Pill>
          {result.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result.summary}</p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">Key points</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {result.highlights.map((h, idx) => (
            <li key={`${idx}-${h.slice(0, 12)}`}>{h}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
