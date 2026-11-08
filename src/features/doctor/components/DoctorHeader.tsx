import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LogOut, Home, Settings, ChevronDown, SunMoon } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/config/routes';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import './DoctorHeader.css';

export interface DoctorHeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  title?: string;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === ROUTES.DOCTOR || pathname === `${ROUTES.DOCTOR}/`) {
    return 'Dashboard';
  }
  if (pathname.startsWith(ROUTES.DOCTOR_REQUESTS)) {
    return 'Requests';
  }
  if (pathname.startsWith(ROUTES.DOCTOR_PATIENTS)) {
    return 'Patients';
  }
  if (pathname.startsWith(ROUTES.DOCTOR_YOGA)) {
    return 'Yoga Schedule';
  }
  if (pathname.startsWith(ROUTES.DOCTOR_GALLERY)) {
    return 'Gallery';
  }
  if (pathname.startsWith(ROUTES.DOCTOR_SETTINGS)) {
    return 'Settings';
  }
  return 'Dashboard';
};

export const DoctorHeader: React.FC<DoctorHeaderProps> = React.memo(({
  title,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const doctorName = user?.name || 'Dr. Ahalya T.S.';
  const doctorEmail = user?.email || 'ahalya@jeevayurniketan.com';
  const doctorInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0) || 'A';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(() => {
    return title || getPageTitle(location.pathname);
  }, [location.pathname, title]);

  const handleLogout = useCallback(async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
    } finally {
      navigate(ROUTES.LOGIN);
    }
  }, [logout, navigate]);

  // Click outside and ESC key listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="doctor-header">
      <div className="doctor-header__left">
        <BrandLogo
          linkTo={ROUTES.DOCTOR}
          size="sm"
          className="doctor-header__brand"
        />
        <span className="doctor-header__page-divider" aria-hidden="true" />
        <h2 className="doctor-header__page-title">{pageTitle}</h2>
      </div>

      <div className="doctor-header__actions">
        {/* Quick link to public sanctuary website */}
        <Link
          to={ROUTES.HOME}
          className="doctor-header__home-btn"
          title="Return to Public Website"
          aria-label="Return to Public Website"
        >
          <Home size={15} />
          <span>Website</span>
        </Link>

        {/* Doctor Profile Dropdown Container */}
        <div className="doctor-header__profile-container" ref={dropdownRef}>
          <button
            type="button"
            className={`doctor-header__profile-trigger ${isDropdownOpen ? 'is-open' : ''}`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Doctor Profile and Account Menu"
          >
            <div className="doctor-header__avatar-wrap">
              <div className="doctor-header__avatar">{doctorInitial}</div>
              <span className="doctor-header__status-dot" title="Active on Duty" />
            </div>

            <div className="doctor-header__profile-info">
              <span className="doctor-header__profile-name">{doctorName}</span>
              <span className="doctor-header__profile-role">Chief Physician</span>
            </div>

            <ChevronDown
              size={14}
              className={`doctor-header__chevron ${isDropdownOpen ? 'is-rotated' : ''}`}
            />
          </button>

          {/* Premium Human-Crafted Dropdown Menu */}
          {isDropdownOpen && (
            <div className="doctor-header__dropdown" role="menu">
              {/* Profile Card Header */}
              <div className="doctor-header__dropdown-header">
                <div className="doctor-header__avatar-wrap">
                  <div className="doctor-header__dropdown-avatar">{doctorInitial}</div>
                  <span className="doctor-header__status-dot" title="Active on Duty" />
                </div>
                <div className="doctor-header__dropdown-user">
                  <strong className="doctor-header__dropdown-name">{doctorName}</strong>
                  <span className="doctor-header__dropdown-email">{doctorEmail}</span>
                  <span className="doctor-header__dropdown-badge">Chief Physician</span>
                </div>
              </div>

              <div className="doctor-header__dropdown-divider" />

              {/* Navigation Items */}
              <div className="doctor-header__dropdown-section">
                <Link
                  to={ROUTES.DOCTOR_SETTINGS}
                  className={`doctor-header__dropdown-item ${
                    location.pathname.startsWith(ROUTES.DOCTOR_SETTINGS) ? 'active' : ''
                  }`}
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings size={16} />
                  <span>Account &amp; Clinical Settings</span>
                </Link>
              </div>

              <div className="doctor-header__dropdown-divider" />

              {/* Theme Toggle Switcher Row */}
              <div className="doctor-header__dropdown-theme-row">
                <div className="doctor-header__dropdown-theme-label">
                  <SunMoon size={16} />
                  <span>Appearance</span>
                </div>
                <ThemeToggle />
              </div>

              <div className="doctor-header__dropdown-divider" />

              {/* Logout Action */}
              <div className="doctor-header__dropdown-section">
                <button
                  type="button"
                  className="doctor-header__dropdown-item doctor-header__dropdown-item--logout"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

DoctorHeader.displayName = 'DoctorHeader';
