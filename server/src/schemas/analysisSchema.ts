import { z } from 'zod';

// Severity can come from AI as lower or upper case — normalise on ingest
const severityEnum = z.enum(['high', 'medium', 'low']).transform(
  (v) => v.charAt(0).toUpperCase() + v.slice(1) as 'High' | 'Medium' | 'Low'
);

export const GeminiClauseSchema = z.object({
  category: z.string().min(1).max(100),
  severity: severityEnum,
  title: z.string().min(1).max(200),
  originalText: z.string().min(1).max(2000),
  simpleExplanation: z.string().min(1).max(1000),
  whyItMatters: z.string().min(1).max(1000),
  questionWorthAsking: z.string().min(1).max(500),
  extraSimpleExplanation: z.string().min(1).max(300),
});

export const GeminiCategorySchema = z.object({
  name: z.string().min(1).max(100),
  severity: severityEnum,
  score: z.number().int().min(0).max(100),
});

export const GeminiUnclearAreaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(600),
});

export const GeminiResponseSchema = z.object({
  documentName: z.string().min(1).max(200),
  attentionScore: z.number().int().min(0).max(100),
  attentionLevel: z.enum(['high', 'medium', 'low']).transform(
    (v) => v.charAt(0).toUpperCase() + v.slice(1) as 'High' | 'Medium' | 'Low'
  ),
  summary: z.string().min(1).max(1000),
  categories: z.array(GeminiCategorySchema).min(0).max(20),
  clauses: z.array(GeminiClauseSchema).min(0).max(30),
  beforeYouSign: z.array(z.string().min(1).max(300)).min(0).max(10),
  unclearAreas: z.array(GeminiUnclearAreaSchema).min(0).max(10),
});

export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;

/**
 * Normalise the validated Gemini response into the frontend AnalysisResult shape.
 * Adds server-generated `id` fields that the frontend components expect.
 */
export function normaliseToAnalysisResult(
  raw: GeminiResponse,
  documentName: string
) {
  return {
    id: `analysis-${Date.now()}`,
    documentName: documentName || raw.documentName || 'Contract Analysis',
    attentionScore: raw.attentionScore,
    riskLevel: raw.attentionLevel,
    summary: raw.summary,
    analyzedAt: new Date().toISOString(),
    categories: raw.categories.map((cat) => ({
      name: cat.name,
      severity: cat.severity,
      clauseCount: raw.clauses.filter(
        (c) => c.category.toLowerCase() === cat.name.toLowerCase()
      ).length,
    })),
    clauses: raw.clauses.map((clause, i) => ({
      id: `clause-${i + 1}-${Date.now()}`,
      category: clause.category,
      severity: clause.severity,
      title: clause.title,
      originalText: clause.originalText,
      simpleExplanation: clause.simpleExplanation,
      whyItMatters: clause.whyItMatters,
      questionToAsk: clause.questionWorthAsking,
      simplestVersion: clause.extraSimpleExplanation,
    })),
    beforeYouSign: raw.beforeYouSign.map((text, i) => ({
      id: `bys-${i + 1}`,
      text,
      // Infer severity from whether the text matches a high-severity clause category
      severity: 'Medium' as 'High' | 'Medium' | 'Low',
    })),
    unclearAreas: raw.unclearAreas.map((area, i) => ({
      id: `unclear-${i + 1}`,
      title: area.title,
      description: area.description,
    })),
  };
}
