import { Shield, Info, AlertCircle, Scale } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    iconColor: '#e07520',
    iconBg: 'rgba(224, 117, 32, 0.1)',
    iconBorder: 'rgba(224, 117, 32, 0.25)',
    title: 'What ClauseGuard Does',
    content:
      'ClauseGuard provides informational document analysis to help you understand the content of contracts and agreements. It identifies clauses that may deserve closer attention, explains them in plain language, and suggests questions you may want to raise.',
  },
  {
    icon: AlertCircle,
    iconColor: '#f87171',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconBorder: 'rgba(239, 68, 68, 0.25)',
    title: 'What ClauseGuard Is Not',
    content:
      'ClauseGuard is not a law firm and does not provide legal advice. The analysis produced is for informational purposes only and should not be relied upon as a substitute for advice from a qualified legal professional. Always consult a licensed attorney for important legal decisions.',
  },
  {
    icon: Info,
    iconColor: '#38bdf8',
    iconBg: 'rgba(56, 189, 248, 0.1)',
    iconBorder: 'rgba(56, 189, 248, 0.25)',
    title: 'How the Analysis Works',
    content:
      'ClauseGuard uses AI-powered language analysis to scan contract text, identify common clause types, and produce plain-language summaries. The Attention Score reflects the overall complexity and number of clauses that warrant closer review — it is not a measure of legal validity or enforceability.',
  },
  {
    icon: Scale,
    iconColor: '#a78bfa',
    iconBg: 'rgba(167, 139, 250, 0.1)',
    iconBorder: 'rgba(167, 139, 250, 0.25)',
    title: 'Use Cases',
    content:
      'ClauseGuard is designed for ordinary users reviewing employment agreements, rental contracts, freelance agreements, service terms, and similar documents. It is not designed for complex corporate transactions, litigation, or specialized legal instruments.',
  },
];

export default function AboutContent() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 animate-pulse-glow" style={{
          background: 'linear-gradient(135deg, #e07520, #cc5e17)',
        }}>
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="font-extrabold mb-4 text-3xl" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          About ClauseGuard
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
          Helping you understand what you're agreeing to, before you agree to it.
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="glass-card p-6 flex gap-4">
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: section.iconBg, border: `1px solid ${section.iconBorder}` }}
              >
                <Icon size={20} style={{ color: section.iconColor }} />
              </div>
              <div>
                <h2 className="font-semibold text-base mb-2" style={{ color: '#e2e8f0' }}>
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  {section.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer box */}
      <div className="mt-8 rounded-2xl p-5 text-center" style={{
        background: 'rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}>
        <p className="text-sm font-medium" style={{ color: '#f87171' }}>
          ⚖️ Informational analysis only. Not a substitute for professional legal advice.
        </p>
        <p className="text-xs mt-2" style={{ color: '#64748b' }}>
          ClauseGuard does not establish an attorney-client relationship.
        </p>
      </div>
    </div>
  );
}
