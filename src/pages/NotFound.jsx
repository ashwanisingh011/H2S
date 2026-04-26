import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center p-6">
      <div className="classic-card rounded-xl p-10 max-w-md text-center">
        <p className="text-7xl font-bold text-white opacity-10 mb-4" aria-hidden="true">404</p>
        <h1 className="text-2xl font-medium text-white mb-3">Page Not Found</h1>
        <p className="text-[#a3a3a3] text-sm mb-8 leading-relaxed">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="classic-button px-6 py-3 rounded text-sm font-medium flex items-center justify-center gap-2 mx-auto"
          aria-label="Return to the home page"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Home
        </button>
      </div>
    </main>
  );
}
