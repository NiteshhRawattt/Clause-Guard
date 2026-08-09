import type { AnalysisResult } from '../types';

const STORAGE_KEY = 'clauseguard_history';
const MAX_HISTORY_ITEMS = 10;

export interface StoredHistoryEntry {
  id: string;
  documentName: string;
  attentionScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  analyzedAt: string;
  result: AnalysisResult; // full result stored for re-opening
}

function readStorage(): StoredHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredHistoryEntry[];
  } catch {
    return [];
  }
}

function writeStorage(entries: StoredHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage may be unavailable (private browsing / quota exceeded) — fail silently
  }
}

export function saveToHistory(result: AnalysisResult): void {
  const entries = readStorage();

  // Deduplicate by id — replace if already exists
  const filtered = entries.filter((e) => e.id !== result.id);

  const newEntry: StoredHistoryEntry = {
    id: result.id,
    documentName: result.documentName,
    attentionScore: result.attentionScore,
    riskLevel: result.riskLevel,
    analyzedAt: result.analyzedAt,
    result,
  };

  // Most recent first, cap at MAX_HISTORY_ITEMS
  writeStorage([newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS));
}

export function getHistory(): StoredHistoryEntry[] {
  return readStorage();
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
