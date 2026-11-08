import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, ArrowLeft, ChevronDown, Copy, Check, Activity } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  private handleReset = () => {
    const isChunkError =
      this.state.error?.message?.includes('dynamically imported module') ||
      this.state.error?.message?.includes('Loading chunk');

    if (isChunkError && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.DOCTOR;
    }
  };

  private handleCopyDetails = () => {
    if (!navigator.clipboard || !this.state.error) return;
    const text = `${this.state.error.name}: ${this.state.error.message}\n${this.state.error.stack || ''}\n${
      this.state.errorInfo?.componentStack || ''
    }`;
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError =
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="modern-error-boundary" role="alert">
          <div className="modern-error-card">
            {/* Ambient Botanical Glow Ring */}
            <div className="modern-error-glow" aria-hidden="true" />

            {/* Top Status Pill */}
            <div className="modern-error-pill">
              <span className="modern-error-dot" />
              <span>{isChunkError ? 'Component Sync Required' : 'Clinical View Recovery'}</span>
            </div>

            {/* Center Human Emblem */}
            <div className="modern-error-emblem-wrap">
              <div className="modern-error-emblem-inner">
                <Activity size={26} className="modern-error-emblem-icon" />
              </div>
            </div>

            {/* Heading & Human Description */}
            <h2 className="modern-error-title">
              {isChunkError ? 'View Update Available' : 'Unable to Load This Clinical View'}
            </h2>
            <p className="modern-error-description">
              {isChunkError
                ? 'An updated clinical component bundle was deployed. A quick refresh will synchronize your interface with the latest version.'
                : 'Our clinical service encountered an unexpected response while rendering this section. Your patient records and session data remain safe.'}
            </p>

            {/* Action Buttons Row */}
            <div className="modern-error-actions">
              <button
                type="button"
                className="btn-modern-error-primary"
                onClick={this.handleReset}
              >
                <RefreshCw size={15} className="btn-icon-spin-hover" />
                <span>{isChunkError ? 'Refresh Application' : 'Reload View'}</span>
              </button>

              <button
                type="button"
                className="btn-modern-error-secondary"
                onClick={this.handleGoDashboard}
              >
                <ArrowLeft size={15} />
                <span>Dashboard Overview</span>
              </button>
            </div>

            {/* Developer Diagnostics Disclosure */}
            {this.state.error && (
              <div className="modern-error-diagnostics">
                <button
                  type="button"
                  className="diagnostics-toggle-btn"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  aria-expanded={this.state.showDetails}
                >
                  <span>Diagnostic details</span>
                  <ChevronDown
                    size={14}
                    className={`diagnostics-chevron ${this.state.showDetails ? 'is-open' : ''}`}
                  />
                </button>

                {this.state.showDetails && (
                  <div className="diagnostics-panel">
                    <div className="diagnostics-panel-header">
                      <span className="diagnostics-badge">Error Trace</span>
                      <button
                        type="button"
                        className="diagnostics-copy-btn"
                        onClick={this.handleCopyDetails}
                        title="Copy diagnostic trace"
                      >
                        {this.state.copied ? (
                          <>
                            <Check size={13} className="text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Trace</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="diagnostics-code-block">
                      <code>
                        {this.state.error.name}: {this.state.error.message}
                        {this.state.error.stack ? `\n\n${this.state.error.stack}` : ''}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
