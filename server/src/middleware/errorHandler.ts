import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handler — never exposes stack traces or internal details to client.
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log full error server-side only
  console.error('[ClauseGuard Error]', {
    message: err.message,
    code: err.code,
    // Stack logged server-side, never sent to client
    stack: process.env.NODE_ENV === 'development' ? err.stack : '[hidden]',
  });

  // ZodError = validation failure from Gemini response parse
  if (err instanceof ZodError) {
    res.status(502).json({
      error:
        'The AI returned an unexpected response format. Please try again.',
      code: 'AI_RESPONSE_INVALID',
    });
    return;
  }

  // Known application errors
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code ?? 'APP_ERROR',
    });
    return;
  }

  // Gemini API key missing
  if (err.message?.includes('GEMINI_API_KEY')) {
    res.status(503).json({
      error: 'Analysis service is not configured. Please contact support.',
      code: 'SERVICE_UNAVAILABLE',
    });
    return;
  }

  // Gemini quota / rate limit errors
  if (
    err.message?.toLowerCase().includes('quota') ||
    err.message?.toLowerCase().includes('rate limit') ||
    err.message?.toLowerCase().includes('429')
  ) {
    res.status(429).json({
      error: 'Analysis service is temporarily busy. Please try again in a moment.',
      code: 'RATE_LIMITED',
    });
    return;
  }

  // Generic fallback — never expose internal details
  res.status(500).json({
    error: 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}
