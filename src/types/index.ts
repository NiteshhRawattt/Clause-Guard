export type Severity = 'High' | 'Medium' | 'Low';

export interface ClauseCard {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  originalText: string;
  simpleExplanation: string;
  whyItMatters: string;
  questionToAsk: string;
  simplestVersion: string;
}

export interface CategorySummary {
  name: string;
  severity: Severity;
  clauseCount: number;
}

export interface UnclearArea {
  id: string;
  title: string;
  description: string;
}

export interface BeforeYouSignItem {
  id: string;
  text: string;
  severity: Severity;
}

export interface AnalysisResult {
  id: string;
  documentName: string;
  attentionScore: number;
  riskLevel: Severity;
  summary: string;
  categories: CategorySummary[];
  clauses: ClauseCard[];
  unclearAreas: UnclearArea[];
  beforeYouSign: BeforeYouSignItem[];
  analyzedAt: string;
}

export interface HistoryEntry {
  id: string;
  documentName: string;
  attentionScore: number;
  riskLevel: Severity;
  analyzedAt: string;
}
