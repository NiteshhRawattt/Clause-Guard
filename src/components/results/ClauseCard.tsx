import { useState } from 'react';
import { ChevronDown, ChevronUp, Quote, Lightbulb, AlertTriangle, MessageSquare, Zap } from 'lucide-react';
import type { ClauseCard as ClauseCardType, Severity } from '../../types';

interface ClauseCardProps {
  clause: ClauseCardType;
  index: number;
}

const severityConfig: Record<Severity, { chipClass: string; color: string; border: string; headerBg: string }> = {
  High: {
    chipClass: 'chip-high',
    color: '#f87171',
    border: 'rgba(239, 68, 68, 0.25)',
    headerBg: 'rgba(239, 68, 68, 0.04)',
  },
  Medium: {
    chipClass: 'chip-medium',
    color: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.25)',
    headerBg: 'rgba(245, 158, 11, 0.04)',
  },
  Low: {
    chipClass: 'chip-low',
    color: '#34d399',
    border: 'rgba(16, 185, 129, 0.25)',
    headerBg: 'rgba(16, 185, 129, 0.04)',
  },
};

export default function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [simplest, setSimplest] = useState(false);

  const cfg = severityConfig[clause.severity];

  return (
    <div
      className="glass-card overflow-hidden animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {/* Card header */}
      <div
        className="flex items-start justify-between p-5 cursor-pointer select-none"
        style={{ background: cfg.headerBg, borderBottom: expanded ? `1px solid ${cfg.border}` : 'none' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider"
              style={{
                background: `${cfg.color}15`,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
              }}
            >
              {clause.category}
            </span>
            <span className={cfg.chipClass}>{clause.severity}</span>
          </div>
          <h4 className="font-semibold text-sm pr-4" style={{ color: '#e2e8f0' }}>
            {clause.title}
          </h4>
        </div>
        <div className="flex-shrink-0 mt-0.5" style={{ color: '#64748b' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="p-5 flex flex-col gap-5">
          {/* Original clause */}
          <div className="rounded-xl p-4" style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Quote size={13} style={{ color: '#475569' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                Original Clause
              </span>
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: '#94a3b8' }}>
              "{clause.originalText}"
            </p>
          </div>

          {/* In simple words */}
          <div className="rounded-xl p-4" style={{
            background: 'rgba(224, 117, 32, 0.06)',
            border: '1px solid rgba(224, 117, 32, 0.15)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} style={{ color: '#e07520' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#e07520' }}>
                In Simple Words
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {clause.simpleExplanation}
            </p>
          </div>

          {/* Why it matters */}
          <div className="rounded-xl p-4" style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} style={{ color: '#f87171' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f87171' }}>
                Why This Matters
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {clause.whyItMatters}
            </p>
          </div>

          {/* Question to ask */}
          <div className="rounded-xl p-4" style={{
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} style={{ color: '#38bdf8' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#38bdf8' }}>
                Question Worth Asking
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {clause.questionToAsk}
            </p>
          </div>

          {/* Explain Simply button & panel */}
          <div>
            <button
              className="btn-ghost text-xs font-semibold"
              onClick={() => setSimplest(s => !s)}
              style={{
                background: simplest ? 'rgba(167, 139, 250, 0.1)' : undefined,
                borderColor: simplest ? 'rgba(167, 139, 250, 0.3)' : undefined,
                color: simplest ? '#a78bfa' : undefined,
              }}
            >
              <Zap size={13} />
              {simplest ? 'Hide' : 'Explain Simply'}
            </button>

            {simplest && (
              <div className="mt-3 rounded-xl p-4 animate-fade-in" style={{
                background: 'rgba(167, 139, 250, 0.08)',
                border: '1px solid rgba(167, 139, 250, 0.2)',
              }}>
                <p className="text-sm leading-relaxed font-medium" style={{ color: '#c4b5fd' }}>
                  ⚡ {clause.simplestVersion}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
