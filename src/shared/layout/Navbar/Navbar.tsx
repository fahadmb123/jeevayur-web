import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { User, Menu, X, LogIn, LogOut, SunMoon } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'About', path: ROUTES.ABOUT },
  { label: 'Treatments', path: ROUTES.SERVICES },
  { label: 'Yoga', path: ROUTES.YOGA },
  { label: 'Team', path: ROUTES.TEAM },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export const Navbar: React.FC = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [logout]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(prev => {
            const isScrolled = window.scrollY > 40;
            return prev !== isScrolled ? isScrolled : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'scrolled' : 'transparent-top'}`}>
        <nav className="navbar" aria-label="Primary Navigation">
          <div className="navbar-brand-section">
            <BrandLogo linkTo={ROUTES.HOME} showDivider={false} size="md" />
          </div>

          <div className="navbar-nav-pill">
            <ul className="navbar-links">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.path === ROUTES.HOME
                    ? location.pathname === ROUTES.HOME
                    : location.pathname.startsWith(link.path);

                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`navbar-link-item ${isActive ? 'active-link' : ''}`}
                    >
                      {isActive && <span className="navbar-link-dot" aria-hidden="true" />}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="navbar-actions">
            <div className="navbar-theme-toggle-desktop">
              <ThemeToggle />
            </div>

            <div className="navbar-action-divider" aria-hidden="true" />

            <Link
              to={isAuthenticated ? ROUTES.DOCTOR : ROUTES.LOGIN}
              className={`navbar-login-btn ${
                location.pathname === ROUTES.LOGIN || location.pathname.startsWith(ROUTES.DOCTOR)
                  ? 'active'
                  : ''
              }`}
              aria-label={isAuthenticated ? 'Doctor Portal' : 'Login'}
              title={isAuthenticated ? 'Doctor Portal' : 'Doctor & Staff Login'}
            >
              {isAuthenticated ? (
                <>
                  <User size={15} />
                  <span>Portal</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Login</span>
                </>
              )}
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                className="navbar-logout-btn"
                onClick={handleLogout}
                aria-label="Log Out"
                title="Log Out of Jeevayurniketan"
              >
                <LogOut size={14} />
                <span className="navbar-logout-text">Logout</span>
              </button>
            )}

            <div className="navbar-cta-wrap">
              <BookAppointmentButton size="sm" />
            </div>

            <button
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <BrandLogo linkTo={ROUTES.HOME} size="sm" />
              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mobile-menu-links">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.path === ROUTES.HOME
                    ? location.pathname === ROUTES.HOME
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={isActive ? 'is-active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mobile-menu-divider" />

              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.DOCTOR}
                    className={`mobile-menu-portal-link ${location.pathname.startsWith(ROUTES.DOCTOR) ? 'is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Doctor Portal</span>
                  </Link>

                  <button
                    type="button"
                    className="mobile-menu-logout-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className={`mobile-menu-portal-link ${location.pathname === ROUTES.LOGIN ? 'is-active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              )}

              <div className="mobile-menu-divider" />

              <div className="mobile-menu-theme-row">
                <div className="mobile-menu-theme-info">
                  <SunMoon size={17} className="mobile-menu-theme-icon" />
                  <div className="mobile-menu-theme-text">
                    <span className="mobile-menu-theme-title">Appearance</span>
                    <span className="mobile-menu-theme-sub">Light / Dark</span>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className="mobile-menu-footer">
              <BookAppointmentButton size="lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Navbar.displayName = 'Navbar';
