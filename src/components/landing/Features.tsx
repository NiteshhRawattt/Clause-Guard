import { Eye, MessageSquare, AlertTriangle, Layers } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Plain-Language Explanations',
    description: 'Complex legal language translated into clear, everyday English so you know exactly what you\'re agreeing to.',
    color: '#e07520',
    bg: 'rgba(224, 117, 32, 0.08)',
    border: 'rgba(224, 117, 32, 0.2)',
  },
  {
    icon: AlertTriangle,
    title: 'Attention Score',
    description: 'Every clause is rated by attention level — High, Medium, or Low — so you know where to focus your review.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  {
    icon: MessageSquare,
    title: 'Questions Worth Asking',
    description: 'For each flagged clause, we suggest the right questions to bring to the other party or your advisor.',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)',
    border: 'rgba(56, 189, 248, 0.2)',
  },
  {
    icon: Layers,
    title: 'Multi-Document Support',
    description: 'Works with employment agreements, rental contracts, freelance terms, service agreements, and more.',
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.08)',
    border: 'rgba(167, 139, 250, 0.2)',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="font-bold mb-4" style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
          }}>
            What ClauseGuard does for you
          </h2>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Not legal advice — but a powerful first pass at understanding what you're about to sign.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card p-6 flex flex-col gap-4 group hover:translate-y-[-2px] transition-transform duration-200"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  border: `1px solid ${feature.border}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: feature.bg, border: `1px solid ${feature.border}` }}
                >
                  <Icon size={20} style={{ color: feature.color }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm" style={{ color: '#e2e8f0' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supported doc types */}
        <div className="mt-12 text-center">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#475569', fontWeight: 600 }}>
            Designed for
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Employment Agreement', 'Rental Agreement', 'Freelance Contract', 'Service Agreement', 'Terms & Conditions'].map(type => (
              <span key={type} className="glass-card-light text-xs px-3 py-1.5 font-medium" style={{ color: '#94a3b8' }}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
