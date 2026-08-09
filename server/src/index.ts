import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import analyzeRouter from './routes/analyze.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '500kb' }));  // text requests stay small

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', analyzeRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  console.log(`\n🛡  ClauseGuard API server running`);
  console.log(`   Port    : ${PORT}`);
  console.log(`   CORS    : ${ALLOWED_ORIGIN}`);
  console.log(`   API key : ${hasKey ? '✓ loaded' : '✗ MISSING — set GEMINI_API_KEY in server/.env'}`);
  console.log('');
});

export default app;
