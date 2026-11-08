import React, { useCallback, useMemo } from 'react';
import { LogOut, Home } from 'lucide-react';
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
  const doctorInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0) || 'A';

  const pageTitle = useMemo(() => {
    return title || getPageTitle(location.pathname);
  }, [location.pathname, title]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      navigate(ROUTES.LOGIN);
    }
  }, [logout, navigate]);

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
        <Link
          to={ROUTES.HOME}
          className="doctor-header__home-btn"
          title="Return to Public Website"
          aria-label="Return to Public Website"
        >
          <Home size={15} />
          <span>Website</span>
        </Link>

        <div className="doctor-header__theme-wrap">
          <ThemeToggle />
        </div>

        <span className="doctor-header__divider" aria-hidden="true" />

        <Link
          to={ROUTES.DOCTOR_SETTINGS}
          className={`doctor-header__profile-pill ${
            location.pathname.startsWith(ROUTES.DOCTOR_SETTINGS) ? 'active' : ''
          }`}
          title={`${doctorName} (Chief Physician) • View Settings`}
          aria-label="Doctor Profile & Settings"
        >
          <div className="doctor-header__avatar-wrap">
            <div className="doctor-header__avatar">{doctorInitial}</div>
            <span className="doctor-header__status-dot" title="Active on Duty" />
          </div>

          <div className="doctor-header__profile-info">
            <span className="doctor-header__profile-name">{doctorName}</span>
            <span className="doctor-header__profile-role">Chief Physician</span>
          </div>
        </Link>

        <button
          type="button"
          className="doctor-header__logout-btn"
          onClick={handleLogout}
          title="Log out of doctor portal"
          aria-label="Log out"
        >
          <LogOut size={15} />
          <span className="doctor-header__logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
});

DoctorHeader.displayName = 'DoctorHeader';

