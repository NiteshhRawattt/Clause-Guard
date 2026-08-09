import { GoogleGenAI } from '@google/genai';
import { GeminiResponseSchema } from '../schemas/analysisSchema';

// ─── System prompt ──────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are ClauseGuard, an AI document analysis assistant.

IMPORTANT RULES:
1. You provide INFORMATIONAL document analysis only. You do NOT provide legal advice.
2. Do NOT state whether a contract is legally valid, enforceable, safe, illegal, fair, or unfair as a definitive legal conclusion.
3. Identify clauses that may deserve attention based solely on the supplied contract text.
4. Explain practical implications in plain, everyday English.
5. Use cautious language: "may", "could", "appears to", "worth reviewing", "not clearly detected", "seems to".
6. Do NOT invent laws, jurisdictions, legal requirements, or industry standards.
7. Base ALL clause analysis ONLY on the text provided. Do not assume context not in the document.
8. If a topic is absent or unclear in the document, say "not clearly detected" — do not invent it.
9. The "Attention Score" reflects how many clauses deserve review, not whether the contract is legally safe.
10. Be neutral and balanced. Your goal is to help the user ask better questions, not frighten them.

You must respond with valid JSON only — no markdown code fences, no prose, no explanation outside the JSON.`;

// ─── JSON Schema for structured output ──────────────────────────────────────
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    documentName: { type: 'string' },
    attentionScore: { type: 'integer', minimum: 0, maximum: 100 },
    attentionLevel: { type: 'string', enum: ['high', 'medium', 'low'] },
    summary: { type: 'string' },
    categories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          score: { type: 'integer', minimum: 0, maximum: 100 },
        },
        required: ['name', 'severity', 'score'],
      },
    },
    clauses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          title: { type: 'string' },
          originalText: { type: 'string' },
          simpleExplanation: { type: 'string' },
          whyItMatters: { type: 'string' },
          questionWorthAsking: { type: 'string' },
          extraSimpleExplanation: { type: 'string' },
        },
        required: [
          'category', 'severity', 'title', 'originalText',
          'simpleExplanation', 'whyItMatters', 'questionWorthAsking',
          'extraSimpleExplanation',
        ],
      },
    },
    beforeYouSign: { type: 'array', items: { type: 'string' } },
    unclearAreas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: [
    'documentName', 'attentionScore', 'attentionLevel', 'summary',
    'categories', 'clauses', 'beforeYouSign', 'unclearAreas',
  ],
};

// ─── User prompt ─────────────────────────────────────────────────────────────
function buildUserPrompt(contractText: string, documentName: string): string {
  return `Please analyse the following contract document and return a structured JSON analysis.

Document name: ${documentName}

CONTRACT TEXT:
---
${contractText}
---

Instructions:
- Identify all notable clauses (termination, non-compete, IP, confidentiality, payment, renewal, liability, dispute resolution, etc.)
- For each clause: extract the relevant original text, explain it simply, state why it may matter, and suggest a useful question to ask.
- Compute an attentionScore (0–100):
  * 0–39 = low (few clauses need review)
  * 40–69 = medium (some clauses worth reviewing)
  * 70–100 = high (several clauses that clearly deserve review)
- Base the score on: number of high-severity clauses × 15, medium × 8, unclear areas × 5. Cap at 100.
- For "extraSimpleExplanation": give the absolute simplest one-sentence summary a non-lawyer would understand.
- For "beforeYouSign": list the 3–5 most important points as short, plain-language strings.
- For "unclearAreas": note any standard clause types that appear absent or not clearly defined in this document.
- Use cautious language throughout. Never state legal conclusions.

Return ONLY valid JSON matching the required schema.`;
}

let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genaiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

/**
 * Call Gemini with structured JSON output mode and validate the response.
 */
export async function analyseContractWithGemini(
  contractText: string,
  documentName: string
) {
  const client = getClient();

  const response = await client.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: buildUserPrompt(contractText, documentName) }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.3, // lower = more consistent structured output
      maxOutputTokens: 8192,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error('Gemini returned an empty response');
  }

  // Strip any accidental markdown fences before parsing
  const cleanedText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error('Gemini response was not valid JSON');
  }

  // Validate with Zod — throws ZodError with details if invalid
  const validated = GeminiResponseSchema.parse(parsed);
  return validated;
}
