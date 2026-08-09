import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { mockAnalysisResult } from '../data/mockAnalysis';
import ScoreHeader from '../components/results/ScoreHeader';
import CategoryOverview from '../components/results/CategoryOverview';
import ClauseCard from '../components/results/ClauseCard';
import BeforeYouSign from '../components/results/BeforeYouSign';
import UnclearAreas from '../components/results/UnclearAreas';

export default function ResultsPage() {
  const navigate = useNavigate();
  const result = mockAnalysisResult;

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <button className="btn-ghost text-sm" onClick={() => navigate('/analyze')}>
            <ArrowLeft size={15} />
            New Analysis
          </button>
          <button className="btn-ghost text-sm" onClick={() => alert('Export feature coming soon!')}>
            <Download size={15} />
            Export PDF
          </button>
        </div>

        {/* Score Header */}
        <ScoreHeader result={result} />

        {/* Before You Sign — prominent position */}
        <BeforeYouSign items={result.beforeYouSign} />

        {/* Category Overview */}
        <CategoryOverview categories={result.categories} />

        {/* Clause Cards */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4 animate-fade-in" style={{ color: '#f1f5f9' }}>
            Clause Analysis
            <span className="ml-2 text-sm font-normal" style={{ color: '#64748b' }}>
              — click a card to expand
            </span>
          </h3>
          <div className="flex flex-col gap-4">
            {result.clauses.map((clause, i) => (
              <ClauseCard key={clause.id} clause={clause} index={i} />
            ))}
          </div>
        </div>

        {/* Unclear Areas */}
        <UnclearAreas areas={result.unclearAreas} />

        {/* Disclaimer */}
        <div className="text-center mt-8 pb-4 animate-fade-in" style={{ color: '#475569', fontSize: '0.8rem' }}>
          <p>This analysis is for informational purposes only and does not constitute legal advice.</p>
          <p className="mt-1">ClauseGuard is not a law firm. Consult a qualified legal professional for your specific situation.</p>
        </div>
      </div>
    </main>
  );
}
