import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  ShieldCheck,
  Heart,
  AlertCircle,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/button';
import { authService } from '../services/authService';
import loginSanctuaryImg from '@/assets/login_sanctuary.jpg';
import './AuthPages.css';

type TokenStatus = 'checking' | 'valid' | 'missing' | 'invalid';

export const ResetPasswordPage: React.FC = React.memo(() => {
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() =>
    token ? 'checking' : 'missing'
  );
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const verifyToken = useCallback(async (tokenToVerify: string) => {
    try {
      setTokenStatus('checking');
      setTokenErrorMessage(null);

      const result = await authService.verifyResetToken(tokenToVerify);

      if (result.valid) {
        setTokenStatus('valid');
        if (result.email) {
          setMaskedEmail(result.email);
        }
      } else {
        setTokenStatus('invalid');
        setTokenErrorMessage(
          result.message || 'This password reset link has expired or has already been used.'
        );
      }
    } catch (err: unknown) {
      setTokenStatus('invalid');
      setTokenErrorMessage(
        err instanceof Error ? err.message : 'Unable to verify password reset link.'
      );
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setTokenStatus('missing');
      return;
    }

    verifyToken(token);
  }, [token, verifyToken]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setFormError('Missing password reset token. Please use the exact link sent to your email.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmation) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await authService.resetPassword(token, password);
      setCompleted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to update password. Your reset link may have expired.';
      setFormError(msg);

      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        setTokenStatus('invalid');
        setTokenErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-split">
      <div className="auth-split-left">
        <img
          src={loginSanctuaryImg}
          alt="Jeevayurniketan serene Ayurvedic healing sanctuary with Uruli flower bowl and teakwood meditation room"
          className="auth-split-bg-img"
        />
        <div className="auth-split-overlay" />

        <div className="auth-split-left-top">
          <Link to={ROUTES.HOME} className="auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="auth-sanctuary-pill">
            <Sparkles size={13} />
            <span>Classical Ayurvedic Healing</span>
          </div>
        </div>

        <div className="auth-split-left-bottom">
          <div className="auth-quote-card">
            <div className="auth-quote-stars">★★★★★</div>
            <p className="auth-quote-text">
              “Restoring deep biological harmony and dissolving psychosomatic distress through classical Caraka Samhita and guided Smriti meditation.”
            </p>
            <div className="auth-quote-author">
              <span className="author-name">Jeevayurniketan Ayurveda</span>
              <span className="author-meta">Clinical Practice of Dr. Ahalya T.S.</span>
            </div>
          </div>

          <div className="auth-trust-badges">
            <span className="auth-trust-chip">
              <ShieldCheck size={13} /> Classical Heritage
            </span>
            <span className="auth-trust-chip">
              <Heart size={13} /> Mind-Body Wellness
            </span>
          </div>
        </div>
      </div>

      <div className="auth-split-right">
        <div className="auth-split-right-inner">
          <div className="auth-split-header">
            <div className="auth-brand-row">
              <BrandLogo linkTo={ROUTES.HOME} size="md" className="auth-brand-logo" />
              <Link
                to={ROUTES.HOME}
                className="auth-home-btn"
                aria-label="Return to Home page"
                title="Return to Home page"
              >
                <ArrowLeft size={15} />
                <span>Home</span>
              </Link>
            </div>

            <h1 className="auth-split-title">
              {tokenStatus === 'valid'
                ? 'Create New Password'
                : tokenStatus === 'checking'
                ? 'Verifying Link...'
                : tokenStatus === 'missing'
                ? 'Missing Reset Link'
                : 'Link Expired'}
            </h1>

            <p className="auth-split-subtitle">
              {tokenStatus === 'valid'
                ? 'Choose a strong password to protect your clinical account.'
                : tokenStatus === 'checking'
                ? 'Checking security credentials with the sanctuary database.'
                : tokenStatus === 'missing'
                ? 'A valid email security link is required to reset your password.'
                : 'This password reset link is no longer valid.'}
            </p>
          </div>

          {/* STATE 1: MISSING TOKEN IN URL */}
          {tokenStatus === 'missing' && (
            <div className="auth-status-card auth-status-card--error">
              <div className="auth-status-card__icon-wrap">
                <AlertCircle size={28} />
              </div>
              <h2 className="auth-status-card__title">Invalid or Missing Reset Link</h2>
              <p className="auth-status-card__desc">
                No security token was detected in your link. Password reset links must be clicked
                directly from the verification email sent to your inbox.
              </p>
              <div className="auth-status-card__actions">
                <Link to={ROUTES.FORGOT_PASSWORD} className="auth-status-card__primary-btn">
                  <RefreshCw size={15} />
                  <span>Request New Reset Link</span>
                </Link>
                <Link to={ROUTES.LOGIN} className="auth-form__text-btn">
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 2: CHECKING TOKEN WITH BACKEND */}
          {tokenStatus === 'checking' && (
            <div className="auth-status-card auth-status-card--loading">
              <div className="auth-status-card__icon-wrap">
                <Loader2 size={26} className="auth-spin-icon" />
              </div>
              <h2 className="auth-status-card__title">Verifying Security Credentials</h2>
              <p className="auth-status-card__desc">
                Please wait a moment while we verify the validity and security expiration of your
                password reset link...
              </p>
            </div>
          )}

          {/* STATE 3: EXPIRED OR INVALID TOKEN */}
          {tokenStatus === 'invalid' && (
            <div className="auth-status-card auth-status-card--error">
              <div className="auth-status-card__icon-wrap">
                <Clock size={28} />
              </div>
              <h2 className="auth-status-card__title">Reset Link Expired or Used</h2>
              <p className="auth-status-card__desc">
                {tokenErrorMessage ||
                  'For your clinical security, password reset links expire after 1 hour or immediately after use.'}
              </p>
              <div className="auth-status-card__actions">
                <Link to={ROUTES.FORGOT_PASSWORD} className="auth-status-card__primary-btn">
                  <RefreshCw size={15} />
                  <span>Request a Fresh Reset Link</span>
                </Link>
                <Link to={ROUTES.LOGIN} className="auth-form__text-btn">
                  <ArrowLeft size={14} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 4: TOKEN IS VALID -> RENDER PASSWORD FORM */}
          {tokenStatus === 'valid' && (
            <>
              {maskedEmail && (
                <div className="auth-account-badge">
                  <Mail size={14} />
                  <span>Resetting password for: <strong>{maskedEmail}</strong></span>
                </div>
              )}

              {formError && <div className="auth-alert-error">{formError}</div>}

              {completed ? (
                <div className="auth-recovery-success">
                  <CheckCircle2 size={26} className="text-primary-green" />
                  <strong>Password updated successfully</strong>
                  <span>Your new password is now active. You can now sign in to your sanctuary.</span>
                  <Link
                    to={ROUTES.LOGIN}
                    className="auth-form__submit"
                    style={{
                      marginTop: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Continue to Sign In</span>
                  </Link>
                </div>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div className="auth-form__group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="auth-form__input-wrap">
                      <LockKeyhole size={18} className="auth-form__icon" />
                      <input
                        id="newPassword"
                        type="password"
                        minLength={8}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="auth-form__group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="auth-form__input-wrap">
                      <LockKeyhole size={18} className="auth-form__icon" />
                      <input
                        id="confirmPassword"
                        type="password"
                        minLength={8}
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="auth-form__submit"
                  >
                    <span>{submitting ? 'Updating Password...' : 'Update Password'}</span>
                  </Button>

                  <div className="auth-form__footer" style={{ justifyContent: 'center' }}>
                    <Link
                      to={ROUTES.LOGIN}
                      className="auth-form__text-btn"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Sign In</span>
                    </Link>
                  </div>
                </form>
              )}
            </>
          )}

          <div className="auth-security-note">
            <ShieldCheck size={14} className="text-primary-green" />
            <span>Protected with 256-bit clinical encryption & confidentiality</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ResetPasswordPage.displayName = 'ResetPasswordPage';
