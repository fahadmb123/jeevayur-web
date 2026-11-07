import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { LoginForm } from '../components/LoginForm';
import { useAuthMutation } from '../hooks/useAuthMutation';
import type { LoginCredentials } from '../types';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import loginSanctuaryImg from '@/assets/login_sanctuary.jpg';
import './AuthPages.css';

export const LoginPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending: loading, error: authError } = useAuthMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLocalError(null);
      const user = await login(credentials);
       if (user.role === 'doctor') {
        navigate(ROUTES.DOCTOR);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    }
  }, [login, navigate]);

  const handleSwitchToRegister = useCallback(() => {
    navigate(ROUTES.REGISTER || '/register');
  }, [navigate]);

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
              <h1 className="auth-split-title">Welcome Back</h1>
              <p className="auth-split-subtitle">
                Sign in to access your consultations, treatment plans & clinical records.
              </p>
            </div>

            {(localError || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-alert-error"
              >
                {localError || authError?.message}
              </motion.div>
            )}

            <LoginForm
              onSubmit={handleLogin}
              isLoading={loading}
              onSwitchToRegister={handleSwitchToRegister}
            />

            <div className="auth-security-note">
              <ShieldCheck size={14} className="text-primary-green" />
              <span>Protected with 256-bit clinical encryption & confidentiality</span>
            </div>

          </div>
        </div>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';
