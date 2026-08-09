import { useSearchParams } from 'react-router-dom';
import AnalysisProgress from '../components/loading/AnalysisProgress';

export default function LoadingPage() {
  const [searchParams] = useSearchParams();
  const isSample = searchParams.get('sample') === 'true';

  return (
    <main className="flex-1">
      <AnalysisProgress isSample={isSample} />
    </main>
  );
}
