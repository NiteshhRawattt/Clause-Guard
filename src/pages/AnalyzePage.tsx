import { useLocation } from 'react-router-dom';
import UploadArea from '../components/analyze/UploadArea';

export default function AnalyzePage() {
  const location = useLocation();
  const isSample = new URLSearchParams(location.search).get('sample') === 'true';

  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="font-extrabold mb-3 animate-fade-in-up" style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
          }}>
            Analyze Your Agreement
          </h1>
          <p className="animate-fade-in-up delay-100" style={{
            color: '#64748b',
            fontSize: '1.05rem',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Upload a PDF or paste contract text below to get your plain-language breakdown.
          </p>
        </div>

        <UploadArea loadSample={isSample} />
      </div>
    </main>
  );
}
