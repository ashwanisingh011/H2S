import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6"
        >
          <div className="classic-card rounded-xl p-10 max-w-md text-center">
            <AlertTriangle size={40} className="mx-auto text-white mb-4 opacity-60" strokeWidth={1} aria-hidden="true" />
            <h1 className="text-2xl font-medium text-white mb-3">Something went wrong</h1>
            <p className="text-[#a3a3a3] text-sm mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="classic-button px-6 py-3 rounded text-sm font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** The child components to render when there is no error */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
