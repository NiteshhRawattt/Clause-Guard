import { FileText, TrendingUp } from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface ScoreHeaderProps {
  result: AnalysisResult;
}

function ScoreRing({ score, level }: { score: number; level: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor = level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        {/* Track */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="rgba(51,65,85,0.4)"
          strokeWidth="8"
        />
        {/* Fill */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${strokeColor}40)` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-extrabold text-3xl leading-none" style={{ color: strokeColor }}>
          {score}
        </div>
        <div className="text-xs font-medium mt-0.5" style={{ color: '#64748b' }}>/ 100</div>
      </div>
    </div>
  );
}

export default function ScoreHeader({ result }: ScoreHeaderProps) {
  const chipClass = result.riskLevel === 'High' ? 'chip-high' : result.riskLevel === 'Medium' ? 'chip-medium' : 'chip-low';

  return (
    <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in">
      {/* Top row: doc name */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
          background: 'rgba(224, 117, 32, 0.1)',
          border: '1px solid rgba(224, 117, 32, 0.25)',
        }}>
          <FileText size={16} style={{ color: '#e07520' }} />
        </div>
        <span className="font-semibold text-sm" style={{ color: '#cbd5e1' }}>{result.documentName}</span>
      </div>

      {/* Score area */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <ScoreRing score={result.attentionScore} level={result.riskLevel} />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h2 className="font-bold text-xl" style={{ color: '#f1f5f9' }}>
              Contract Attention Score
            </h2>
            <span className={chipClass}>{result.riskLevel} Attention</span>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8', maxWidth: 480 }}>
            {result.summary}
          </p>

          <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
            <TrendingUp size={13} />
            <span>Based on {result.clauses.length} clauses across {result.categories.length} categories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
