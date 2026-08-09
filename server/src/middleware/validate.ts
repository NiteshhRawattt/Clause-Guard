import { Request, Response, NextFunction } from 'express';

const MIN_TEXT_LENGTH = 100;      // characters
const MAX_TEXT_LENGTH = 100_000;  // characters (~25k tokens)
const MAX_DOC_NAME_LENGTH = 200;

/**
 * Validate a text-based analysis request body.
 */
export function validateTextRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { text, documentName } = req.body as {
    text?: unknown;
    documentName?: unknown;
  };

  if (!text || typeof text !== 'string') {
    res.status(400).json({
      error: 'Missing required field: text',
      code: 'MISSING_TEXT',
    });
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
    res.status(400).json({
      error: 'documentName must be a string.',
      code: 'INVALID_DOC_NAME',
    });
    return;
  }

  if (
    typeof documentName === 'string' &&
    documentName.length > MAX_DOC_NAME_LENGTH
  ) {
    res.status(400).json({
      error: `documentName is too long (max ${MAX_DOC_NAME_LENGTH} characters).`,
      code: 'DOC_NAME_TOO_LONG',
    });
    return;
  }

  next();
}
