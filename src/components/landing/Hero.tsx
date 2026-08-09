import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(224, 117, 32, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(45, 212, 191, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-in" style={{
            background: 'rgba(224, 117, 32, 0.1)',
            border: '1px solid rgba(224, 117, 32, 0.25)',
            borderRadius: '999px',
            padding: '6px 16px',
          }}>
            <Sparkles size={13} style={{ color: '#e07520' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#e07520' }}>
              AI-Powered Contract Analysis
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-extrabold mb-6 animate-fade-in-up" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#f8fafc',
          }}>
            Understand Before
            <br />
            <span className="gradient-text">You Agree.</span>
          </h1>

          {/* Subheading */}
          <p className="mb-10 animate-fade-in-up delay-100" style={{
            fontSize: '1.2rem',
            lineHeight: 1.7,
            color: '#94a3b8',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
          }}>
            Upload or paste an agreement and get a clear breakdown of important clauses, potential concerns, and questions worth asking before you sign.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 animate-fade-in-up delay-200">
            <button
              className="btn-primary text-base"
              style={{ padding: '14px 28px' }}
              onClick={() => navigate('/analyze')}
            >
              <FileSearch size={18} />
              Analyze Agreement
              <ArrowRight size={16} />
            </button>
            <button
              className="btn-secondary text-base"
              style={{ padding: '14px 28px' }}
              onClick={() => navigate('/analyze?sample=true')}
            >
              <ShieldCheck size={18} />
              Try Sample Contract
            </button>
          </div>

          {/* Disclaimer */}
          <p className="animate-fade-in delay-300" style={{
            fontSize: '0.78rem',
            color: '#475569',
            fontStyle: 'italic',
          }}>
            Informational analysis only. Not a substitute for professional legal advice.
          </p>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-fade-in delay-400">
            {[
              { value: '6+', label: 'Clause Types' },
              { value: '< 2s', label: 'Analysis Time' },
              { value: '100%', label: 'Private & Local' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-light p-4 text-center">
                <div className="font-bold text-xl mb-1" style={{ color: '#e07520' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
