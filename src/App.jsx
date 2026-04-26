import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Journey from './pages/Journey';
import Quiz from './pages/Quiz';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* Google Translate Widget — rendered in top-right corner */}
        <div
          id="google_translate_element"
          aria-label="Language selector"
          style={{
            position: 'fixed',
            top: '12px',
            right: '16px',
            zIndex: 1000,
            opacity: 0.8,
          }}
        />
        <div className="font-sans text-slate-100 selection:bg-blue-500/30">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
