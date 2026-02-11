export type AnalysisTag =
  | "method"
  | "finding"
  | "limitation"
  | "next-step"
  | "definition"
  | "claim";

export interface AnalysisResult {
  summary: string;
  highlights: string[];
  tags: AnalysisTag[];
  confidence: "low" | "medium" | "high";
}

export interface AnalyzeRequest {
  text: string;
}
