import React, { Component, useState, type ErrorInfo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { Navbar } from '@/shared/layout/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
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
}

interface FullPageErrorViewProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  isChunkError: boolean;
}

const FullPageErrorView: React.FC<FullPageErrorViewProps> = React.memo(
  ({ error, errorInfo, onReset, isChunkError }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    // Only doctors who are signed in see doctor portal options
    const isDoctor = Boolean(isAuthenticated && user?.role === 'doctor');

    const handleCopyDetails = () => {
      if (!navigator.clipboard || !error) return;
      const text = `${error.name}: ${error.message}\n\nStack:\n${error.stack || ''}\n\nComponent Stack:\n${
        errorInfo?.componentStack || ''
      }`;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="full-error-page" role="alert">
        {/* Real Website Navbar - Fixed at the top, identical to live sanctuary website */}
        <Navbar />

        {/* Expansive Main Body - Padded so fixed navbar never obscures it */}
        <main className="full-error-main">
          <div className="full-error-content-wrapper">
            {/* Serene Kerala Botanical Art Emblem */}
            <div className="full-error-artwork-area">
              <div className="full-error-illustration-wrap">
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
                {isChunkError ? 'Application Update Available' : 'Sanctuary Service Standby'}
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="full-error-headline">
              {isChunkError
                ? "We've updated this application view"
                : "We're restoring balance to this view"}
            </h1>

            <p className="full-error-subtext">
              {isChunkError
                ? 'A fresh component build was deployed in the background. A quick reload will synchronize your view with the latest release.'
                : 'An unexpected response occurred while rendering this section. Your data, session, and sanctuary records are safe and undisturbed.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="full-error-btn-cluster">
              <button
                type="button"
                className="full-error-btn full-error-btn--primary"
                onClick={onReset}
              >
                <RefreshCw size={17} className="spin-on-hover" />
                <span>{isChunkError ? 'Refresh Application' : 'Reload View'}</span>
              </button>

              {isDoctor ? (
                <button
                  type="button"
                  className="full-error-btn full-error-btn--secondary"
                  onClick={() => navigate(ROUTES.DOCTOR)}
                >
                  <LayoutDashboard size={17} />
                  <span>Doctor Dashboard</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="full-error-btn full-error-btn--secondary"
                  onClick={() => navigate(ROUTES.SERVICES)}
                >
                  <Sparkles size={17} />
                  <span>Ayurvedic Treatments</span>
                </button>
              )}

              <button
                type="button"
                className="full-error-btn full-error-btn--ghost"
                onClick={() => navigate(ROUTES.HOME)}
              >
                <Home size={17} />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Helpful Quick Navigation Cards (Amazon / Flipkart Style) */}
            <div className="full-error-helpful-grid">
              {isDoctor ? (
                <>
                  <div
                    className="helpful-card"
                    onClick={() => navigate(ROUTES.DOCTOR_REQUESTS)}
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
                    onClick={() => navigate(ROUTES.DOCTOR_PATIENTS)}
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
                    onClick={() => navigate(ROUTES.CONTACT)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="helpful-card__icon-wrap">
                      <PhoneCall size={18} />
                    </div>
                    <div className="helpful-card__text">
                      <strong className="helpful-card__title">Sanctuary Support</strong>
                      <span className="helpful-card__desc">Direct desk: {CLINIC_CONTACT.phone}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="helpful-card"
                    onClick={() => navigate(ROUTES.SERVICES)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="helpful-card__icon-wrap">
                      <Activity size={18} />
                    </div>
                    <div className="helpful-card__text">
                      <strong className="helpful-card__title">Ayurvedic Treatments</strong>
                      <span className="helpful-card__desc">Classical Panchakarma &amp; healing therapies</span>
                    </div>
                  </div>

                  <div
                    className="helpful-card"
                    onClick={() => navigate(ROUTES.YOGA)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="helpful-card__icon-wrap">
                      <Sparkles size={18} />
                    </div>
                    <div className="helpful-card__text">
                      <strong className="helpful-card__title">Yoga Sanctuary</strong>
                      <span className="helpful-card__desc">Therapeutic Asana &amp; Pranayama schedule</span>
                    </div>
                  </div>

                  <div
                    className="helpful-card"
                    onClick={() => navigate(ROUTES.CONTACT)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="helpful-card__icon-wrap">
                      <PhoneCall size={18} />
                    </div>
                    <div className="helpful-card__text">
                      <strong className="helpful-card__title">Sanctuary Desk</strong>
                      <span className="helpful-card__desc">Contact Dr. Ahalya T.S. &amp; wellness team</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Collapsible Technical Diagnostics for Engineers */}
            {error && (
              <div className="full-error-diagnostics">
                <button
                  type="button"
                  className="full-error-diagnostics-toggle"
                  onClick={() => setShowDetails((prev) => !prev)}
                  aria-expanded={showDetails}
                >
                  <span>Technical Diagnostics</span>
                  <ChevronDown
                    size={14}
                    className={`diagnostics-chevron ${showDetails ? 'is-open' : ''}`}
                  />
                </button>

                {showDetails && (
                  <div className="full-error-diagnostics-box">
                    <div className="diagnostics-box-bar">
                      <span className="diagnostics-box-tag">Exception Stack</span>
                      <button
                        type="button"
                        className="diagnostics-copy-pill"
                        onClick={handleCopyDetails}
                      >
                        {copied ? (
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
                        {error.name}: {error.message}
                        {error.stack ? `\n\n${error.stack}` : ''}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Sanctuary Security & Legal Footer */}
        <footer className="full-error-footer">
          <div className="full-error-footer__content">
            <div className="full-error-security-tag">
              <ShieldCheck size={14} className="security-icon" />
              <span>Protected by Jeevayurniketan Sanctuary Data Encryption &amp; NABH Safeguards</span>
            </div>
            <p className="full-error-copyright">
              &copy; {new Date().getFullYear()} Jeevayurniketan Ayurveda &amp; Psychotherapy Clinic. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }
);

FullPageErrorView.displayName = 'FullPageErrorView';

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  private handleReset = () => {
    const isChunkError = Boolean(
      this.state.error?.message?.includes('dynamically imported module') ||
      this.state.error?.message?.includes('Loading chunk')
    );

    if (isChunkError && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = Boolean(
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Loading chunk')
      );

      return (
        <FullPageErrorView
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          isChunkError={isChunkError}
        />
      );
    }

    return this.props.children;
  }
}
