"use client";

import { useCallback } from "react";
import { NoteForm } from "@/components/NoteForm";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { useAsync } from "@/hooks/useAsync";
import { analyzeText } from "@/lib/analyzeText";

export default function HomePage() {
  const { execute, loading, error, value, reset } = useAsync(async (text: string) => {
    return analyzeText({ text });
  });

  const handleAnalyze = useCallback(
    async (text: string) => {
      await execute(text);
    },
    [execute]
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <header className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Research Note Organizer</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          A small Next.js + TypeScript demo showing clean component structure, typed async flows, and accessible UI.
        </p>
      </header>

      <div className="space-y-5">
        <NoteForm onAnalyze={handleAnalyze} loading={loading} onReset={reset} />

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Spinner label="Analyzing text" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-700 shadow-sm" role="alert">
            {error}
          </div>
        )}

        {value && <ResultPanel result={value} />}
      </div>

      <footer className="mt-10 text-xs text-slate-500">
        Tip: Keep code samples small, readable, and representative. This project is intentionally scoped for quick review.
      </footer>
    </main>
  );
}
