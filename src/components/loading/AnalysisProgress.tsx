import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { analysisSteps } from '../../data/mockAnalysis';

export default function AnalysisProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let stepIndex = 0;
    let elapsed = 0;
    const total = analysisSteps.reduce((s, step) => s + step.duration, 0) + 400;

    const runStep = () => {
      if (stepIndex >= analysisSteps.length) {
        setTimeout(() => navigate('/results'), 400);
        return;
      }

      setCurrentStep(stepIndex);
      const duration = analysisSteps[stepIndex].duration;

      // progress bar ticks
      const tickInterval = 50;
      let ticked = 0;
      const ticker = setInterval(() => {
        ticked += tickInterval;
        elapsed += tickInterval;
        setProgress(Math.min((elapsed / total) * 100, 95));
        if (ticked >= duration) clearInterval(ticker);
      }, tickInterval);

      setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex]);
        stepIndex++;
        runStep();
      }, duration);
    };

    const startTimer = setTimeout(runStep, 200);
    return () => clearTimeout(startTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse at center, rgba(224, 117, 32, 0.05) 0%, transparent 70%)',
    }}>
      <div className="glass-card p-10 max-w-md w-full text-center">
        {/* Animated icon */}
        <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full animate-spin-slow" style={{
            background: 'conic-gradient(from 0deg, #e07520, transparent 60%)',
            opacity: 0.4,
          }} />
          {/* Inner circle */}
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
          Reading your contract and identifying key clauses…
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-8 text-left">
          {analysisSteps.map((step, idx) => {
            const isComplete = completedSteps.includes(idx);
            const isActive = currentStep === idx && !isComplete;
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
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid rgba(71, 85, 105, 0.5)',
                    flexShrink: 0,
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
