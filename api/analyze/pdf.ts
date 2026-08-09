import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import { analyseContractWithGemini } from '../../server/src/services/gemini.service';
import { extractTextFromPdf } from '../../server/src/services/pdf.service';
import { normaliseToAnalysisResult } from '../../server/src/schemas/analysisSchema';

// ─── Limits ──────────────────────────────────────────────────────────────────
// Vercel hard limit is 4.5 MB for ALL plans (Hobby and Pro).
// We enforce 4 MB to stay safely below that ceiling.
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

/**
 * POST /api/analyze/pdf
 * Accepts multipart/form-data with fields:
 *   file        — the PDF binary (required)
 *   documentName — human-readable name (optional)
 *
 * PDF bytes are parsed entirely in memory via busboy (no disk writes).
 * This is required for Vercel serverless functions which have no persistent /tmp.
 */
export const config = {
  api: {
    // Disable Vercel's built-in body parser so we can handle raw multipart ourselves.
    bodyParser: false,
  },
};

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const contentType = req.headers['content-type'] ?? '';
  if (!contentType.includes('multipart/form-data')) {
    res.status(400).json({
      error: 'Request must be multipart/form-data.',
      code: 'INVALID_CONTENT_TYPE',
    });
    return;
  }

  // Parse multipart in memory
  let busboy: Busboy.Busboy;
  try {
    busboy = Busboy({
      headers: req.headers as Record<string, string>,
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    });
  } catch {
    res.status(400).json({ error: 'Invalid multipart request.', code: 'INVALID_MULTIPART' });
    return;
  }

  const fileChunks: Buffer[] = [];
  let fileFound = false;
  let fileSizeLimitHit = false;
  let originalFileName = 'Uploaded Document.pdf';
  let documentName = '';
  let mimeType = '';

  busboy.on('file', (fieldname, fileStream, info) => {
    if (fieldname !== 'file') {
      fileStream.resume(); // discard unexpected fields
      return;
    }
    fileFound = true;
    mimeType = info.mimeType;
    originalFileName = info.filename || originalFileName;

    fileStream.on('data', (chunk: Buffer) => {
      fileChunks.push(chunk);
    });

    fileStream.on('limit', () => {
      fileSizeLimitHit = true;
    });
  });

  busboy.on('field', (fieldname, value) => {
    if (fieldname === 'documentName') {
      documentName = value;
    }
  });

  busboy.on('finish', () => {
    // Run the async processing after busboy finishes
    void processUpload();
  });

  busboy.on('error', (err: Error) => {
    console.error('[analyze/pdf] busboy error:', err.message);
    res.status(400).json({ error: 'Failed to parse file upload.', code: 'UPLOAD_PARSE_ERROR' });
  });

  req.pipe(busboy);

  async function processUpload(): Promise<void> {
    try {
      if (fileSizeLimitHit) {
        res.status(413).json({
          error: `PDF file exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
          code: 'FILE_TOO_LARGE',
        });
        return;
      }

      if (!fileFound || fileChunks.length === 0) {
        res.status(400).json({ error: 'No PDF file was uploaded.', code: 'MISSING_FILE' });
        return;
      }

      if (mimeType && mimeType !== 'application/pdf') {
        res.status(400).json({ error: 'Only PDF files are accepted.', code: 'INVALID_FILE_TYPE' });
        return;
      }

      const docName = (documentName.trim()) || originalFileName || 'Uploaded Document.pdf';
      console.log('[analyze/pdf] PDF upload, docName:', docName, `(${fileChunks.reduce((s, b) => s + b.length, 0)} bytes)`);

      const pdfBuffer = Buffer.concat(fileChunks);

      // Extract text from PDF buffer — entirely in memory
      const extractedText = await extractTextFromPdf(pdfBuffer);

      if (extractedText.trim().length < 100) {
        res.status(400).json({
          error: 'The PDF does not contain enough readable text to analyse.',
          code: 'TEXT_TOO_SHORT',
        });
        return;
      }

      const geminiResult = await analyseContractWithGemini(extractedText, docName);
      const normalised = normaliseToAnalysisResult(geminiResult, docName);

      res.status(200).json(normalised);
    } catch (err) {
      handleError(err, res);
    }
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
