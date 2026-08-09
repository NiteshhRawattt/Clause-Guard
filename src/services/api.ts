import type { AnalysisResult } from '../types';

// Base URL — falls back to same origin if VITE_API_URL is not set (works with Vite proxy)
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

interface ApiError {
  error: string;
  code: string;
}

function isApiError(body: unknown): body is ApiError {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as ApiError).error === 'string'
  );
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      isApiError(body) ? body.error : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

/**
 * Analyse contract text via the backend.
 */
export async function analyzeText(
  text: string,
  documentName = 'Contract Analysis'
): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, documentName }),
  });
  return handleResponse<AnalysisResult>(res);
}

/**
 * Analyse a PDF file via the backend.
 */
export async function analyzePdf(
  file: File,
  documentName?: string
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('documentName', documentName ?? file.name);

  const res = await fetch(`${API_BASE}/api/analyze/pdf`, {
    method: 'POST',
    body: form,
    // No Content-Type header — browser sets it automatically with boundary for multipart
  });
  return handleResponse<AnalysisResult>(res);
}

/**
 * Health-check the backend.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
