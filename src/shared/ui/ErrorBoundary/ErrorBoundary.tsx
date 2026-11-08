import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  RefreshCw,
  Home,
  LayoutDashboard,
  ChevronDown,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Users,
  HelpCircle,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  fullPage?: boolean;
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

  private handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  private handleCopyDetails = () => {
    if (!navigator.clipboard || !this.state.error) return;
    const text = `${this.state.error.name}: ${this.state.error.message}\n\nStack:\n${
      this.state.error.stack || ''
    }\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;

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
        <div className="full-error-page" role="alert">
          {/* 1. Official Enterprise Brand Header */}
          <header className="full-error-header">
            <div className="full-error-header__container">
              <BrandLogo size="md" linkTo={ROUTES.HOME} />
              <nav className="full-error-header__nav" aria-label="Quick links">
                <button
                  type="button"
                  className="full-error-nav-link"
                  onClick={() => this.handleNavigate(ROUTES.HOME)}
                >
                  <Home size={15} />
                  <span>Sanctuary Home</span>
                </button>
                <button
                  type="button"
                  className="full-error-nav-link"
                  onClick={() => this.handleNavigate(ROUTES.DOCTOR)}
                >
                  <LayoutDashboard size={15} />
                  <span>Doctor Portal</span>
                </button>
              </nav>
            </div>
          </header>

          {/* 2. Main Full-View Canvas Area */}
          <main className="full-error-main">
            <div className="full-error-content-wrapper">
              {/* Botanical Artwork / Metaphor Emblem */}
              <div className="full-error-artwork-area">
                <div className="full-error-illustration-wrap">
                  {/* Calming Organic Botanical Leaf & Sanctuary Geometry */}
                  <svg
                    className="full-error-svg-art"
                    viewBox="0 0 240 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary-green, #1B6B50)" />
                        <stop offset="100%" stopColor="var(--primary-green-light, #2A8566)" />
                      </linearGradient>
                      <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--accent-gold, #C98D3B)" />
                        <stop offset="100%" stopColor="#EBB666" />
                      </linearGradient>
                    </defs>

                    {/* Ambient Aura Circles */}
                    <circle cx="120" cy="90" r="72" fill="var(--primary-green-tint, #EDF6F1)" opacity="0.6" />
                    <circle cx="120" cy="90" r="54" stroke="var(--border-color, #E2E8DE)" strokeWidth="1.5" strokeDasharray="4 4" />

                    {/* Sacred Lotus / Holy Basil Leaf Motif */}
                    <path
                      d="M120 30 C150 65 170 100 120 150 C70 100 90 65 120 30 Z"
                      fill="url(#leafGrad)"
                      opacity="0.9"
                    />
                    <path
                      d="M120 30 C120 75 120 115 120 150"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.65"
                    />

                    {/* Side Flank Petals */}
                    <path
                      d="M120 70 C160 80 185 110 155 145 C135 125 125 105 120 70 Z"
                      fill="url(#goldGrad)"
                      opacity="0.75"
                    />
                    <path
                      d="M120 70 C80 80 55 110 85 145 C105 125 115 105 120 70 Z"
                      fill="url(#goldGrad)"
                      opacity="0.75"
                    />
                  </svg>
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="full-error-status-badge">
                <span className="full-error-pulse-dot" />
                <span>
                  {isChunkError ? 'Application Update Available' : 'Clinical Service Standby'}
                </span>
              </div>

              {/* Editorial Headings */}
              <h1 className="full-error-headline">
                {isChunkError
                  ? "We've updated this clinical application"
                  : "We're restoring balance to this view"}
              </h1>

              <p className="full-error-subtext">
                {isChunkError
                  ? 'A fresh component build was deployed. A quick refresh will synchronize your workspace with the latest updates.'
                  : 'An unexpected response occurred while rendering this section. Your patient records, prescriptions, and consultation notes are completely safe and intact.'}
              </p>

              {/* Primary Action Button Cluster */}
              <div className="full-error-btn-cluster">
                <button
                  type="button"
                  className="full-error-btn full-error-btn--primary"
                  onClick={this.handleReset}
                >
                  <RefreshCw size={17} className="spin-on-hover" />
                  <span>{isChunkError ? 'Refresh Application' : 'Reload This View'}</span>
                </button>

                <button
                  type="button"
                  className="full-error-btn full-error-btn--secondary"
                  onClick={() => this.handleNavigate(ROUTES.DOCTOR)}
                >
                  <LayoutDashboard size={17} />
                  <span>Doctor Dashboard</span>
                </button>

                <button
                  type="button"
                  className="full-error-btn full-error-btn--ghost"
                  onClick={() => this.handleNavigate(ROUTES.HOME)}
                >
                  <Home size={17} />
                  <span>Return to Home</span>
                </button>
              </div>

              {/* Real Website Help Cards (like Amazon/Flipkart navigation assists) */}
              <div className="full-error-helpful-grid">
                <div
                  className="helpful-card"
                  onClick={() => this.handleNavigate(ROUTES.DOCTOR_REQUESTS)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="helpful-card__icon-wrap">
                    <Calendar size={18} />
                  </div>
                  <div className="helpful-card__text">
                    <strong className="helpful-card__title">Clinical Schedule</strong>
                    <span className="helpful-card__desc">Review appointments and consultation slots</span>
                  </div>
                </div>

                <div
                  className="helpful-card"
                  onClick={() => this.handleNavigate(ROUTES.DOCTOR_PATIENTS)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="helpful-card__icon-wrap">
                    <Users size={18} />
                  </div>
                  <div className="helpful-card__text">
                    <strong className="helpful-card__title">Patient Directory</strong>
                    <span className="helpful-card__desc">Browse treatment records and medical charts</span>
                  </div>
                </div>

                <div
                  className="helpful-card"
                  onClick={() => this.handleNavigate(ROUTES.CONTACT)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="helpful-card__icon-wrap">
                    <HelpCircle size={18} />
                  </div>
                  <div className="helpful-card__text">
                    <strong className="helpful-card__title">Sanctuary Support</strong>
                    <span className="helpful-card__desc">Direct desk: +91 73567 02775</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Technical Diagnostics (for developers) */}
              {this.state.error && (
                <div className="full-error-diagnostics">
                  <button
                    type="button"
                    className="full-error-diagnostics-toggle"
                    onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                    aria-expanded={this.state.showDetails}
                  >
                    <span>Technical Diagnostics</span>
                    <ChevronDown
                      size={14}
                      className={`diagnostics-chevron ${this.state.showDetails ? 'is-open' : ''}`}
                    />
                  </button>

                  {this.state.showDetails && (
                    <div className="full-error-diagnostics-box">
                      <div className="diagnostics-box-bar">
                        <span className="diagnostics-box-tag">Exception Stack</span>
                        <button
                          type="button"
                          className="diagnostics-copy-pill"
                          onClick={this.handleCopyDetails}
                        >
                          {this.state.copied ? (
                            <>
                              <Check size={12} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Trace</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="diagnostics-pre">
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
          </main>

          {/* 3. Reassuring Compliance & Security Footer */}
          <footer className="full-error-footer">
            <div className="full-error-footer__content">
              <div className="full-error-security-tag">
                <ShieldCheck size={14} className="security-icon" />
                <span>Protected by Jeevayurniketan Clinical Data Encryption &amp; NABH Safeguards</span>
              </div>
              <p className="full-error-copyright">
                &copy; {new Date().getFullYear()} Jeevayurniketan Ayurveda &amp; Psychotherapy Clinic. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}
