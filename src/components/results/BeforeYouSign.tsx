import { ShieldAlert } from 'lucide-react';
import type { BeforeYouSignItem, Severity } from '../../types';

interface BeforeYouSignProps {
  items: BeforeYouSignItem[];
}

const dotColor: Record<Severity, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

export default function BeforeYouSign({ items }: BeforeYouSignProps) {
  return (
    <div className="rounded-2xl p-6 mb-6 animate-fade-in delay-200" style={{
      background: 'linear-gradient(135deg, rgba(224, 117, 32, 0.06) 0%, rgba(239, 68, 68, 0.04) 100%)',
      border: '1px solid rgba(224, 117, 32, 0.2)',
    }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
        }}>
          <ShieldAlert size={18} style={{ color: '#f87171' }} />
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: '#f1f5f9' }}>
            Before You Sign
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            Top items deserving your attention
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:translate-x-1"
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(51, 65, 85, 0.4)',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{ background: dotColor[item.severity] }}
            />
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
