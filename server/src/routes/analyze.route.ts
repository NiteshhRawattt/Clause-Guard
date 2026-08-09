import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validateTextRequest } from '../middleware/validate';
import { analyseContractWithGemini } from '../services/gemini.service';
import { extractTextFromPdfPath } from '../services/pdf.service';
import { normaliseToAnalysisResult } from '../schemas/analysisSchema';

const router = Router();

// ─── Multer setup for PDF uploads ────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 10;
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted.'));
    }
  },
});

// ─── GET /api/health ─────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ClauseGuard API',
  });
});

// ─── POST /api/analyze (JSON text) ───────────────────────────────────────────
router.post(
  '/analyze',
  validateTextRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, documentName = 'Contract Analysis' } = req.body as {
        text: string;
        documentName?: string;
      };

      // NOTE: contract text is NOT logged to prevent sensitive data in logs
      console.log('[analyze] text analysis request, docName:', documentName, `(${text.length} chars)`);

      const geminiResult = await analyseContractWithGemini(text.trim(), documentName);
      const normalised = normaliseToAnalysisResult(geminiResult, documentName);

      res.json(normalised);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/analyze/pdf (multipart PDF upload) ────────────────────────────
router.post(
  '/analyze/pdf',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadedFilePath = req.file?.path;
    try {
      if (!req.file) {
        res.status(400).json({
          error: 'No PDF file was uploaded.',
          code: 'MISSING_FILE',
        });
        return;
      }

      const documentName =
        (req.body as { documentName?: string }).documentName ||
        req.file.originalname ||
        'Uploaded Document.pdf';

      console.log('[analyze/pdf] PDF upload, docName:', documentName, `(${req.file.size} bytes)`);

      // Extract text from PDF
      const extractedText = await extractTextFromPdfPath(req.file.path);

      // Validate extracted text length
      if (extractedText.trim().length < 100) {
        res.status(400).json({
          error: 'The PDF does not contain enough readable text to analyse.',
          code: 'TEXT_TOO_SHORT',
        });
        return;
      }

      const geminiResult = await analyseContractWithGemini(extractedText, documentName);
      const normalised = normaliseToAnalysisResult(geminiResult, documentName);

      res.json(normalised);
    } catch (err) {
      next(err);
    } finally {
      // Always clean up uploaded temp file
      if (uploadedFilePath) {
        try {
          fs.unlinkSync(uploadedFilePath);
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }
);

export default router;
