import React, { createContext, useContext, useReducer } from 'react';
import type { AnalysisResult } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AnalysisMode = 'real' | 'sample';

export interface AnalysisState {
  result: AnalysisResult | null;
  mode: AnalysisMode;
  error: string | null;
  /** The pending API promise — set before navigating to /loading */
  pendingRequest: Promise<AnalysisResult> | null;
}

type Action =
  | { type: 'SET_PENDING'; payload: Promise<AnalysisResult> }
  | { type: 'SET_RESULT'; payload: AnalysisResult }
  | { type: 'SET_MODE'; payload: AnalysisMode }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR' };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case 'SET_PENDING':
      return { ...state, pendingRequest: action.payload, error: null };
    case 'SET_RESULT':
      return { ...state, result: action.payload, pendingRequest: null, error: null };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, pendingRequest: null };
    case 'CLEAR':
      return { result: null, mode: 'real', error: null, pendingRequest: null };
    default:
      return state;
  }
}

const initialState: AnalysisState = {
  result: null,
  mode: 'real',
  error: null,
  pendingRequest: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface AnalysisContextValue {
  state: AnalysisState;
  dispatch: React.Dispatch<Action>;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used inside <AnalysisProvider>');
  return ctx;
}
