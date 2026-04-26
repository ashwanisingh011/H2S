import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-load routes for optimal code splitting and faster initial page load
const Home = lazy(() => import('./pages/Home'));
const Journey = lazy(() => import('./pages/Journey'));
const Quiz = lazy(() => import('./pages/Quiz'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Loading fallback shown while a route chunk is being fetched */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    </div>
  );
}

/**
 * Root application component.
 * Wraps all routes in an ErrorBoundary for graceful error handling
 * and uses React.lazy + Suspense for route-level code splitting.
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* Google Translate Widget mounted in top-right corner */}
        <div
          id="google_translate_element"
          aria-label="Language selector"
          style={{ position: 'fixed', top: '12px', right: '16px', zIndex: 1000, opacity: 0.8 }}
        />
        <Suspense fallback={<PageLoader />}>
          <div className="font-sans text-slate-100 selection:bg-blue-500/30">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
