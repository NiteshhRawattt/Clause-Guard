import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50" style={{
      background: 'rgba(10, 15, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(51, 65, 85, 0.4)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #e07520 0%, #cc5e17 100%)',
                boxShadow: '0 0 16px rgba(224, 117, 32, 0.3)',
              }}>
                <Shield size={16} className="text-white" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: '#f1f5f9' }}>
              Clause<span className="gradient-text">Guard</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            <Link
              to="/analyze"
              className={`nav-link ${isActive('/analyze') ? 'active' : ''}`}
            >
              Analyze
            </Link>
            <Link
              to="/history"
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            >
              History
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
