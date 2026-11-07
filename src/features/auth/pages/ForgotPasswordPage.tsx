import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/button';
import loginSanctuaryImg from '@/assets/login_sanctuary.jpg';
import './AuthPages.css';

export const ForgotPasswordPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
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
            <h1 className="auth-split-title">Reset Password</h1>
            <p className="auth-split-subtitle">
              Enter your registered account email and we’ll help you regain access to your sanctuary.
            </p>
          </div>

          {submitted ? (
            <div className="auth-recovery-success">
              <ShieldCheck size={26} className="text-primary-green" />
              <strong>Check your inbox</strong>
              <span>If an account exists for <b>{email}</b>, password recovery instructions have been sent.</span>
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="auth-form__submit"
                style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form__group">
                <label htmlFor="recoveryEmail">Email Address</label>
                <div className="auth-form__input-wrap">
                  <Mail size={18} className="auth-form__icon" />
                  <input
                    id="recoveryEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="doctor@jeevayurniketan.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="auth-form__submit">
                <Send size={17} />
                <span>Send Reset Instructions</span>
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

          <div className="auth-security-note">
            <ShieldCheck size={14} className="text-primary-green" />
            <span>Protected with 256-bit clinical encryption & confidentiality</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ForgotPasswordPage.displayName = 'ForgotPasswordPage';
