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
  const { logout } = useAuth();

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
          <Home size={16} />
          <span>Website</span>
        </Link>
        <ThemeToggle />
        <button
          type="button"
          className="doctor-header__logout-btn"
          onClick={handleLogout}
          title="Log out of doctor portal"
          aria-label="Log out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
});

DoctorHeader.displayName = 'DoctorHeader';

