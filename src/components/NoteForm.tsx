"use client";

import { useId, useMemo, useState } from "react";

type NoteFormProps = {
  onAnalyze: (text: string) => void;
  loading: boolean;
  onReset: () => void;
};

export function NoteForm({ onAnalyze, loading, onReset }: NoteFormProps) {
  const textareaId = useId();
  const [text, setText] = useState("");

  const charCount = text.length;
  const canSubmit = useMemo(() => text.trim().length > 0 && !loading, [text, loading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAnalyze(text);
  }

  function handleExample() {
    const example =
      "We propose a simple method to improve retrieval quality using task decomposition. " +
      "Our results show consistent gains on multiple benchmarks, especially for long-form questions. " +
      "A key limitation is sensitivity to noisy supervision, which we address partially with calibration. " +
      "Future work includes evaluating robustness across domains and integrating human feedback.";
    setText(example);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Paste a research note</h2>
          <p className="mt-1 text-sm text-slate-600">
            This demo simulates an async analysis call and shows how I structure React + TypeScript code.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExample}
          className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Insert example
        </button>
      </div>

      <label htmlFor={textareaId} className="sr-only">
        Research note text
      </label>

      <textarea
        id={textareaId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here…"
        className="mt-4 min-h-[160px] w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 text-slate-900 outline-none focus:border-slate-400"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500" aria-live="polite">
          {charCount.toLocaleString()} characters
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setText("");
              onReset();
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>
    </form>
  );
}
