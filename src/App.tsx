import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Footer />
        </div>
      </AnalysisProvider>
    </BrowserRouter>
  );
}
