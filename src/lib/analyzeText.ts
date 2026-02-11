import type { AnalyzeRequest, AnalysisResult, AnalysisTag } from "@/types/analysis";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock "analysis" function to simulate an async AI call.
 * Written as a separate module to demonstrate an API-layer boundary.
 */
export async function analyzeText(req: AnalyzeRequest): Promise<AnalysisResult> {
  const trimmed = req.text.trim();

  // Simulate latency
  await sleep(650);

  if (!trimmed) {
    throw new Error("Please paste some text to analyze.");
  }

  // Simulate occasional failure to show error handling patterns
  if (trimmed.length > 12000) {
    throw new Error("Text is too long for this demo. Please shorten it.");
  }

  const sentences = trimmed
    .replace(/\s+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .filter(Boolean);

  const summary = sentences.slice(0, 2).join(" ").slice(0, 320) || trimmed.slice(0, 320);

  const highlights = buildHighlights(sentences, trimmed);
  const tags = inferTags(trimmed);

  return {
    summary,
    highlights,
    tags,
    confidence: trimmed.length > 1200 ? "high" : trimmed.length > 400 ? "medium" : "low",
  };
}

function buildHighlights(sentences: string[], raw: string): string[] {
  const candidates = [
    pickSentenceContaining(sentences, /(we propose|we present|we introduce|we develop)/i),
    pickSentenceContaining(sentences, /(results show|we find|our results|we observe)/i),
    pickSentenceContaining(sentences, /(limitation|limitations|future work|we leave|open question)/i),
    pickSentenceContaining(sentences, /(dataset|data|benchmark|evaluation|experiment)/i),
  ].filter((s): s is string => Boolean(s));

  if (candidates.length >= 3) return candidates.slice(0, 4);

  // Fallback: take a few early sentences, but keep them short.
  return sentences
    .slice(0, 4)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.length > 240 ? `${s.slice(0, 240)}…` : s))
    .slice(0, 4);
}

function pickSentenceContaining(sentences: string[], pattern: RegExp): string | null {
  for (const s of sentences) {
    if (pattern.test(s)) return s.trim();
  }
  return null;
}

function inferTags(raw: string): AnalysisTag[] {
  const t = raw.toLowerCase();
  const tags: AnalysisTag[] = [];

  if (/(method|approach|architecture|pipeline|algorithm|model)/i.test(t)) tags.push("method");
  if (/(result|improve|increase|decrease|outperform|accuracy|auc|f1)/i.test(t)) tags.push("finding");
  if (/(limit|limitation|trade-?off|caveat|bias)/i.test(t)) tags.push("limitation");
  if (/(future|next|we plan|we will|follow-?up)/i.test(t)) tags.push("next-step");
  if (/(define|definition|we call|we refer to)/i.test(t)) tags.push("definition");
  if (/(we argue|we claim|suggests that|therefore)/i.test(t)) tags.push("claim");

  return tags.length ? tags.slice(0, 4) : ["method", "finding"];
}
