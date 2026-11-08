import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console with full stack trace for developer diagnosis
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback" role="alert">
          <div className="error-boundary-card">
            <div className="error-boundary-icon-wrap">
              <AlertCircle size={32} className="error-boundary-icon" />
            </div>
            <h3 className="error-boundary-title">Something went wrong</h3>
            <p className="error-boundary-message">
              {this.state.error?.message ||
                'An unexpected error occurred while loading this view. Please try refreshing.'}
            </p>
            <button
              type="button"
              className="error-boundary-btn"
              onClick={this.handleReset}
            >
              <RefreshCw size={15} />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
