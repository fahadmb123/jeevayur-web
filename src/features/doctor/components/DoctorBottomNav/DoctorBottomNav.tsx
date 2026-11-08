import React, { useMemo } from 'react';
import { Activity, Inbox, Users, Sparkles, Settings, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useRequests } from '@/features/requests';
import './DoctorBottomNav.css';

interface BottomNavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export const DoctorBottomNav: React.FC = React.memo(() => {
  const location = useLocation();
  const { pendingCount } = useRequests();

  const navItems = useMemo<BottomNavItem[]>(
    () => [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: ROUTES.DOCTOR,
        icon: <Activity size={20} />,
      },
      {
        id: 'requests',
        label: 'Requests',
        path: ROUTES.DOCTOR_REQUESTS,
        icon: <Inbox size={20} />,
        badge: pendingCount > 0 ? pendingCount : undefined,
      },
      {
        id: 'patients',
        label: 'Patients',
        path: ROUTES.DOCTOR_PATIENTS,
        icon: <Users size={20} />,
      },
      {
        id: 'yoga',
        label: 'Yoga',
        path: ROUTES.DOCTOR_YOGA,
        icon: <Sparkles size={20} />,
      },
      {
        id: 'gallery',
        label: 'Gallery',
        path: ROUTES.DOCTOR_GALLERY,
        icon: <ImageIcon size={20} />,
      },
      {
        id: 'settings',
        label: 'Settings',
        path: ROUTES.DOCTOR_SETTINGS,
        icon: <Settings size={20} />,
      },
    ],
    [pendingCount]
  );

  return (
    <nav className="doctor-bottom-nav" aria-label="Doctor Mobile Navigation">
      <div className="doctor-bottom-nav__container">
        {navItems.map((item) => {
          const isActive =
            item.path === ROUTES.DOCTOR
              ? location.pathname === ROUTES.DOCTOR
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`doctor-bottom-nav__item ${
                isActive ? 'doctor-bottom-nav__item--active' : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="doctor-bottom-nav__icon-wrapper">
                {item.icon}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="doctor-bottom-nav__badge">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="doctor-bottom-nav__label">{item.label}</span>
              {isActive && <span className="doctor-bottom-nav__active-pill" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

DoctorBottomNav.displayName = 'DoctorBottomNav';
