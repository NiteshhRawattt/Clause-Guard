import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle, RefreshCw, FileSearch } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { analysisSteps } from '../../data/mockAnalysis';
import { saveToHistory } from '../../utils/historyStorage';

type StepState = 'pending' | 'active' | 'complete';

interface AnalysisProgressProps {
  isSample?: boolean;
}

export default function AnalysisProgress({ isSample = false }: AnalysisProgressProps) {

  const [stepStates, setStepStates] = useState<StepState[]>(
    analysisSteps.map(() => 'pending')
  );
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { state, dispatch } = useAnalysis();

  // Guard: if we arrive at /loading without a pending request and it's not sample mode,
  // redirect back to analyze
  useEffect(() => {
    if (!isSample && !state.pendingRequest) {
      navigate('/analyze', { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step animation (runs for both modes) ───────────────────────────────────
  const animationDoneRef = useRef(false);

  useEffect(() => {
    let stepIndex = 0;
    let elapsed = 0;
    const total = analysisSteps.reduce((s, step) => s + step.duration, 0) + 400;

    const advance = () => {
      if (stepIndex >= analysisSteps.length) return;

      setStepStates(prev => {
        const next = [...prev];
        next[stepIndex] = 'active';
        return next;
      });

      const duration = analysisSteps[stepIndex].duration;
      const tickInterval = 50;
      let ticked = 0;

      const ticker = setInterval(() => {
        ticked += tickInterval;
        elapsed += tickInterval;
        setProgress(Math.min((elapsed / total) * 100, isSample ? 95 : 80));
        if (ticked >= duration) clearInterval(ticker);
      }, tickInterval);

      setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[stepIndex] = 'complete';
          return next;
        });
        stepIndex++;
        if (stepIndex < analysisSteps.length) {
          advance();
        } else {
          animationDoneRef.current = true;
        }
      }, duration);
    };

    const startTimer = setTimeout(advance, 200);
    return () => clearTimeout(startTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sample mode: navigate after animation completes ────────────────────────
  useEffect(() => {
    if (!isSample) return;

    const totalDuration = analysisSteps.reduce((s, step) => s + step.duration, 0) + 800;
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_MODE', payload: 'sample' });
      setProgress(100);
      setTimeout(() => navigate('/results', { replace: true }), 300);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [isSample, navigate, dispatch]);

  // ── Real mode: await the API promise ───────────────────────────────────────
  useEffect(() => {
    if (isSample || !state.pendingRequest) return;

    state.pendingRequest
      .then((result) => {
        // Save to history
        try { saveToHistory(result); } catch { /* ignore */ }

        dispatch({ type: 'SET_RESULT', payload: result });
        setProgress(100);
        setTimeout(() => navigate('/results', { replace: true }), 400);
      })
      .catch((err: Error) => {
        const message =
          err.message || 'Analysis failed. Please try again.';
        setApiError(message);
        dispatch({ type: 'SET_ERROR', payload: message });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error state ────────────────────────────────────────────────────────────
  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
          }}>
            <AlertCircle size={32} style={{ color: '#f87171' }} />
          </div>
          <h2 className="font-bold text-xl mb-3" style={{ color: '#f1f5f9' }}>
            Analysis Failed
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{
            color: '#94a3b8',
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}>
            {apiError}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn-primary text-sm"
              onClick={() => navigate('/analyze')}
            >
              <RefreshCw size={15} />
              Try Again
            </button>
            <button
              className="btn-secondary text-sm"
              onClick={() => {
                dispatch({ type: 'SET_MODE', payload: 'sample' });
                navigate('/results?sample=true');
              }}
            >
              <FileSearch size={15} />
              View Sample Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal loading UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse at center, rgba(224, 117, 32, 0.05) 0%, transparent 70%)',
    }}>
      <div className="glass-card p-10 max-w-md w-full text-center">
        {/* Animated icon */}
        <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
          <div className="absolute inset-0 rounded-full animate-spin-slow" style={{
            background: 'conic-gradient(from 0deg, #e07520, transparent 60%)',
            opacity: 0.4,
          }} />
          <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{
            background: 'rgba(224, 117, 32, 0.1)',
            border: '1px solid rgba(224, 117, 32, 0.25)',
          }}>
            <Loader size={28} style={{ color: '#e07520' }} className="animate-spin" />
          </div>
        </div>

        <h2 className="font-bold text-xl mb-2" style={{ color: '#f1f5f9' }}>
          Analyzing Agreement
        </h2>
        <p className="text-sm mb-8" style={{ color: '#64748b' }}>
          {isSample
            ? 'Loading sample analysis…'
            : 'Reading your contract and identifying key clauses…'}
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-8 text-left">
          {analysisSteps.map((step, idx) => {
            const s = stepStates[idx];
            const isComplete = s === 'complete';
            const isActive = s === 'active';
            return (
              <div
                key={step.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: isComplete
                    ? 'rgba(16, 185, 129, 0.08)'
                    : isActive
                    ? 'rgba(224, 117, 32, 0.08)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isComplete
                    ? '1px solid rgba(16, 185, 129, 0.2)'
                    : isActive
                    ? '1px solid rgba(224, 117, 32, 0.2)'
                    : '1px solid rgba(51, 65, 85, 0.3)',
                }}
              >
                {isComplete ? (
                  <CheckCircle size={18} style={{ color: '#34d399', flexShrink: 0 }} />
                ) : isActive ? (
                  <Loader size={18} style={{ color: '#e07520', flexShrink: 0 }} className="animate-spin" />
                ) : (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid rgba(71, 85, 105, 0.5)', flexShrink: 0,
                  }} />
                )}
                <span className="text-sm font-medium" style={{
                  color: isComplete ? '#34d399' : isActive ? '#e07520' : '#475569',
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #e07520, #f5a623)',
            }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: '#475569' }}>
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}
