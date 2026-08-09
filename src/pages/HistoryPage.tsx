import { History } from 'lucide-react';
import HistoryList from '../components/history/HistoryList';

export default function HistoryPage() {
  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'rgba(224, 117, 32, 0.1)',
            border: '1px solid rgba(224, 117, 32, 0.25)',
          }}>
            <History size={20} style={{ color: '#e07520' }} />
          </div>
          <div>
            <h1 className="font-bold text-xl" style={{ color: '#f1f5f9' }}>Recent Analyses</h1>
            <p className="text-sm" style={{ color: '#64748b' }}>Click any item to view the full results</p>
          </div>
        </div>

        <HistoryList />

        <p className="text-xs text-center mt-8" style={{ color: '#334155', fontStyle: 'italic' }}>
          History is stored locally in your session. No data is sent to any server.
        </p>
      </div>
    </main>
  );
}
