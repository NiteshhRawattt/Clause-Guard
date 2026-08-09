import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const USE_CASES = [
  'Employment Agreement',
  'Rental Agreement',
  'Freelance Contract',
  'Service Agreement',
  'Terms & Conditions',
];

interface UploadAreaProps {
  loadSample?: boolean;
}

export default function UploadArea({ loadSample = false }: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState(loadSample ? SAMPLE_TEXT : '');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>(loadSample ? 'paste' : 'upload');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError('');
    } else {
      setError('Please upload a PDF file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError('');
    }
  };

  const handleAnalyze = () => {
    if (activeTab === 'upload' && !uploadedFile) {
      setError('Please upload a PDF or switch to the paste tab.');
      return;
    }
    if (activeTab === 'paste' && !pastedText.trim()) {
      setError('Please paste your contract text before analyzing.');
      return;
    }
    setError('');
    navigate('/loading');
  };

  const handleLoadSample = () => {
    setActiveTab('paste');
    setPastedText(SAMPLE_TEXT);
    setError('');
  };

  const handleUseCaseClick = (useCase: string) => {
    setActiveTab('paste');
    setPastedText(`[Sample ${useCase}]\n\n${SAMPLE_TEXT}`);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        width: 'fit-content',
      }}>
        {(['upload', 'paste'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(''); }}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === tab ? 'rgba(224, 117, 32, 0.15)' : 'transparent',
              color: activeTab === tab ? '#e07520' : '#64748b',
              border: activeTab === tab ? '1px solid rgba(224, 117, 32, 0.3)' : '1px solid transparent',
            }}
          >
            {tab === 'upload' ? (
              <span className="flex items-center gap-2"><Upload size={14} /> Upload PDF</span>
            ) : (
              <span className="flex items-center gap-2"><FileText size={14} /> Paste Text</span>
            )}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} p-12 text-center cursor-pointer`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploadedFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                <FileText size={28} style={{ color: '#34d399' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{uploadedFile.name}</p>
                <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                className="btn-ghost text-xs"
                onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                background: 'rgba(224, 117, 32, 0.08)',
                border: '1px solid rgba(224, 117, 32, 0.2)',
              }}>
                <Upload size={30} style={{ color: '#e07520', opacity: 0.7 }} />
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: '#cbd5e1' }}>
                  Drag & drop your PDF here
                </p>
                <p className="text-sm" style={{ color: '#475569' }}>or click to browse files</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{
                background: 'rgba(51, 65, 85, 0.5)',
                color: '#64748b',
                border: '1px solid rgba(71, 85, 105, 0.3)',
              }}>
                PDF files supported
              </span>
            </div>
          )}
        </div>
      )}

      {/* Paste Tab */}
      {activeTab === 'paste' && (
        <div className="relative">
          <textarea
            value={pastedText}
            onChange={e => { setPastedText(e.target.value); setError(''); }}
            placeholder="Paste your contract or agreement text here..."
            rows={12}
            className="w-full rounded-2xl p-5 text-sm leading-relaxed resize-none focus:outline-none transition-all duration-200"
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              color: '#cbd5e1',
              fontFamily: 'Inter, monospace',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(224, 117, 32, 0.4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(51, 65, 85, 0.6)'; }}
          />
          {pastedText && (
            <button
              className="absolute top-3 right-3 btn-ghost text-xs p-1.5"
              onClick={() => setPastedText('')}
            >
              <X size={14} />
            </button>
          )}
          <p className="text-xs mt-2" style={{ color: '#475569' }}>
            {pastedText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#f87171',
        }}>
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button className="btn-primary flex-1 justify-center text-sm" onClick={handleAnalyze}
          style={{ padding: '13px 24px' }}>
          Analyze Agreement
        </button>
        <button className="btn-secondary text-sm" onClick={handleLoadSample}
          style={{ padding: '13px 24px' }}>
          Load Sample Contract
        </button>
      </div>

      {/* Use case pills */}
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>
          Supported document types
        </p>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map(uc => (
            <button
              key={uc}
              onClick={() => handleUseCaseClick(uc)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 hover:scale-105"
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(71, 85, 105, 0.4)',
                color: '#94a3b8',
              }}
            >
              {uc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const SAMPLE_TEXT = `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of January 1, 2025, between Acme Corp ("Company") and John Doe ("Employee").

1. NON-COMPETE: The employee shall not, directly or indirectly, engage in, be employed by, consult for, or have any financial interest in any organization that competes with the Company in any capacity, for a period of twenty-four (24) months following the termination of employment, regardless of cause.

2. TERMINATION: Either party may terminate this Agreement by providing seven (7) days written notice to the other party. The Company reserves the right to terminate immediately for cause, as determined at the Company's sole discretion.

3. INTELLECTUAL PROPERTY: All inventions, discoveries, improvements, works of authorship, and innovations conceived, developed, or reduced to practice by the Employee, whether or not during working hours and whether or not using Company resources, that relate to the Company's current or anticipated business, shall be the exclusive property of the Company.

4. AUTO RENEWAL: This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal no less than sixty (60) days prior to the expiration of the then-current term.

5. CONFIDENTIALITY: The Employee agrees to maintain in strict confidence all Confidential Information received during the course of employment and shall not disclose such information to any third party at any time, whether during or after the term of employment, without prior written consent of the Company.

6. COMPENSATION: The Employee may be eligible for an annual performance bonus at the sole discretion of the Company. The Company makes no guarantee of any bonus payment and reserves the right to modify, suspend, or discontinue the bonus program at any time without notice.`;
