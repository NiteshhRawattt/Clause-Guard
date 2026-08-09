import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(51, 65, 85, 0.4)',
      background: 'rgba(10, 15, 26, 0.8)',
      marginTop: 'auto',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: '#e07520' }} />
            <span className="font-semibold text-sm" style={{ color: '#cbd5e1' }}>ClauseGuard</span>
          </div>
          <p className="text-xs text-center" style={{ color: '#64748b', maxWidth: '480px' }}>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>Informational analysis only.</span>{' '}
            ClauseGuard is not a law firm and does not provide legal advice. Always consult a qualified legal professional for important agreements.
          </p>
          <p className="text-xs" style={{ color: '#475569' }}>
            © {new Date().getFullYear()} ClauseGuard
          </p>
        </div>
      </div>
    </footer>
  );
}
