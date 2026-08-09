import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Clock } from 'lucide-react';
import type { HistoryEntry, Severity } from '../../types';
import { mockHistory } from '../../data/mockAnalysis';

const chipClass: Record<Severity, string> = {
  High: 'chip-high',
  Medium: 'chip-medium',
  Low: 'chip-low',
};

const scoreColor: Record<Severity, string> = {
  High: '#f87171',
  Medium: '#fbbf24',
  Low: '#34d399',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface HistoryListProps {
  compact?: boolean;
}

export default function HistoryList({ compact = false }: HistoryListProps) {
  const navigate = useNavigate();
  const entries: HistoryEntry[] = mockHistory;

  const handleClick = () => {
    navigate('/results');
  };

  return (
    <div className={compact ? '' : 'flex flex-col gap-3'}>
      {entries.map((entry, i) => (
        <button
          key={entry.id}
          onClick={handleClick}
          className="w-full text-left glass-card p-4 sm:p-5 flex items-center gap-4 group transition-all duration-200 hover:translate-y-[-1px] animate-fade-in-up"
          style={{
            animationDelay: `${i * 0.1}s`,
            opacity: 0,
            marginBottom: compact ? '0.75rem' : '0',
            border: '1px solid rgba(51, 65, 85, 0.5)',
          }}
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(71, 85, 105, 0.4)',
          }}>
            <FileText size={18} style={{ color: '#64748b' }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: '#e2e8f0' }}>
              {entry.documentName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={11} style={{ color: '#475569' }} />
              <span className="text-xs" style={{ color: '#475569' }}>{timeAgo(entry.analyzedAt)}</span>
            </div>
          </div>

          {/* Score + chip */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-lg leading-none" style={{ color: scoreColor[entry.riskLevel] }}>
                {entry.attentionScore}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#475569' }}>score</div>
            </div>
            <span className={chipClass[entry.riskLevel]}>{entry.riskLevel}</span>
            <ChevronRight size={15} style={{ color: '#475569' }} className="group-hover:translate-x-1 transition-transform duration-150" />
          </div>
        </button>
      ))}
    </div>
  );
}
