import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyseContractWithGemini } from '../server/src/services/gemini.service';
import { normaliseToAnalysisResult } from '../server/src/schemas/analysisSchema';

// ─── Validation constants (mirrors server/src/middleware/validate.ts) ─────────
const MIN_TEXT_LENGTH = 100;
const MAX_TEXT_LENGTH = 100_000;
const MAX_DOC_NAME_LENGTH = 200;

/**
 * POST /api/analyze
 * Accepts JSON body: { text: string; documentName?: string }
 * Returns the normalised AnalysisResult object.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // ── Input validation ────────────────────────────────────────────────────────
  const body = req.body as { text?: unknown; documentName?: unknown };
  const { text, documentName } = body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Missing required field: text', code: 'MISSING_TEXT' });
    return;
  }

  const trimmed = text.trim();

  if (trimmed.length < MIN_TEXT_LENGTH) {
    res.status(400).json({
      error: `Contract text is too short. Please provide at least ${MIN_TEXT_LENGTH} characters.`,
      code: 'TEXT_TOO_SHORT',
    });
    return;
  }

  if (trimmed.length > MAX_TEXT_LENGTH) {
    res.status(400).json({
      error: `Contract text exceeds the maximum allowed length of ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
      code: 'TEXT_TOO_LONG',
    });
    return;
  }

  if (documentName !== undefined && typeof documentName !== 'string') {
    res.status(400).json({ error: 'documentName must be a string.', code: 'INVALID_DOC_NAME' });
    return;
  }

  if (typeof documentName === 'string' && documentName.length > MAX_DOC_NAME_LENGTH) {
    res.status(400).json({
      error: `documentName is too long (max ${MAX_DOC_NAME_LENGTH} characters).`,
      code: 'DOC_NAME_TOO_LONG',
    });
    return;
  }

  const docName = (typeof documentName === 'string' && documentName) || 'Contract Analysis';

  // ── Gemini call ─────────────────────────────────────────────────────────────
  try {
    console.log('[analyze] text analysis request, docName:', docName, `(${trimmed.length} chars)`);
    const geminiResult = await analyseContractWithGemini(trimmed, docName);
    const normalised = normaliseToAnalysisResult(geminiResult, docName);
    res.status(200).json(normalised);
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: VercelResponse): void {
  const error = err instanceof Error ? err : new Error(String(err));

  console.error('[ClauseGuard Error]', { message: error.message });

  if (error.message?.includes('GEMINI_API_KEY')) {
    res.status(503).json({
      error: 'Analysis service is not configured. Please contact support.',
      code: 'SERVICE_UNAVAILABLE',
    });
    return;
  }

  if (
    error.message?.toLowerCase().includes('quota') ||
    error.message?.toLowerCase().includes('rate limit') ||
    error.message?.toLowerCase().includes('429')
  ) {
    res.status(429).json({
      error: 'Analysis service is temporarily busy. Please try again in a moment.',
      code: 'RATE_LIMITED',
    });
    return;
  }

  // ZodError check by name (avoid importing ZodError to keep bundle lean)
  if ((err as { name?: string })?.name === 'ZodError') {
    res.status(502).json({
      error: 'The AI returned an unexpected response format. Please try again.',
      code: 'AI_RESPONSE_INVALID',
    });
    return;
  }

  res.status(500).json({
    error: 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}
