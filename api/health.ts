import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/health
 * Simple health-check endpoint — no auth, no side effects.
 */
export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ClauseGuard API',
  });
}
