import { HelpCircle } from 'lucide-react';
import type { UnclearArea } from '../../types';

interface UnclearAreasProps {
  areas: UnclearArea[];
}

export default function UnclearAreas({ areas }: UnclearAreasProps) {
  return (
    <div className="glass-card p-6 mb-6 animate-fade-in delay-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
        }}>
          <HelpCircle size={18} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: '#f1f5f9' }}>
            Unclear or Missing Areas
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            Items that appear unclear or were not clearly detected in the reviewed text
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {areas.map((area, i) => (
          <div
            key={area.id}
            className="rounded-xl p-4 flex gap-4"
            style={{
              background: 'rgba(251, 191, 36, 0.04)',
              border: '1px solid rgba(251, 191, 36, 0.15)',
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
              style={{ background: '#f59e0b' }}
            />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#fbbf24' }}>
                {area.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                {area.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-4 italic" style={{ color: '#475569' }}>
        Note: These observations are based on the text analyzed and do not constitute legal assessment.
      </p>
    </div>
  );
}
