import type { CategorySummary, Severity } from '../../types';

interface CategoryOverviewProps {
  categories: CategorySummary[];
}

const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string; barColor: string; width: string }> = {
  High: {
    color: '#f87171',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
    label: 'High',
    barColor: '#ef4444',
    width: '85%',
  },
  Medium: {
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
    label: 'Medium',
    barColor: '#f59e0b',
    width: '55%',
  },
  Low: {
    color: '#34d399',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
    label: 'Low',
    barColor: '#10b981',
    width: '25%',
  },
};

export default function CategoryOverview({ categories }: CategoryOverviewProps) {
  return (
    <div className="glass-card p-6 mb-6 animate-fade-in delay-100">
      <h3 className="font-semibold mb-5 text-sm uppercase tracking-widest" style={{ color: '#64748b' }}>
        Category Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const cfg = severityConfig[cat.severity];
          return (
            <div
              key={cat.name}
              className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{cat.name}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${cfg.barColor}20`,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                  }}
                >
                  {cfg.label}
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: cfg.width,
                    background: `linear-gradient(90deg, ${cfg.barColor}80, ${cfg.barColor})`,
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: '#64748b' }}>
                {cat.clauseCount} clause{cat.clauseCount !== 1 ? 's' : ''} flagged
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
