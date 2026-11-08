import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Settings,
  Inbox,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useRequests } from '@/features/requests';
import type { DoctorNavItem } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import feviconImg from '@/assets/fevicon_rendered.png';
import './DoctorSidebar.css';

export interface DoctorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Shared persistent state so sidebar state is preserved across route changes without re-animation
let globalSidebarOpen = true;
const sidebarListeners = new Set<(open: boolean) => void>();

export const useDoctorSidebar = () => {
  const [isOpen, setIsOpen] = useState(globalSidebarOpen);

  useEffect(() => {
    const listener = (open: boolean) => setIsOpen(open);
    sidebarListeners.add(listener);
    return () => {
      sidebarListeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(() => {
    globalSidebarOpen = !globalSidebarOpen;
    sidebarListeners.forEach((l) => l(globalSidebarOpen));
  }, []);

  return [isOpen, toggle] as const;
};

export const DoctorSidebar: React.FC<DoctorSidebarProps> = React.memo(({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const doctorName = user?.name || 'Dr. Ahalya T.S.';
  const doctorInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0) || 'A';
  const { pendingCount } = useRequests();

  const clinicalItems = useMemo<DoctorNavItem[]>(
    () => [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: ROUTES.DOCTOR,
        icon: <LayoutDashboard size={19} strokeWidth={1.85} />,
      },
      {
        id: 'requests',
        label: 'Requests',
        path: ROUTES.DOCTOR_REQUESTS,
        icon: <Inbox size={19} strokeWidth={1.85} />,
        badge: pendingCount > 0 ? pendingCount : undefined,
      },
      {
        id: 'patients',
        label: 'Patients',
        path: ROUTES.DOCTOR_PATIENTS,
        icon: <Users size={19} strokeWidth={1.85} />,
      },
    ],
    [pendingCount]
  );

  const sanctuaryItems = useMemo<DoctorNavItem[]>(
    () => [
      {
        id: 'yoga',
        label: 'Yoga Schedule',
        path: ROUTES.DOCTOR_YOGA,
        icon: <Sparkles size={19} strokeWidth={1.85} />,
      },
      {
        id: 'gallery',
        label: 'Gallery',
        path: ROUTES.DOCTOR_GALLERY,
        icon: <ImageIcon size={19} strokeWidth={1.85} />,
      },
    ],
    []
  );

  const systemItems = useMemo<DoctorNavItem[]>(
    () => [
      {
        id: 'settings',
        label: 'Settings',
        path: ROUTES.DOCTOR_SETTINGS,
        icon: <Settings size={19} strokeWidth={1.85} />,
      },
    ],
    []
  );

  const renderNavItem = useCallback(
    (item: DoctorNavItem) => {
      const isActive =
        item.path === ROUTES.DOCTOR
          ? location.pathname === ROUTES.DOCTOR || location.pathname === `${ROUTES.DOCTOR}/`
          : location.pathname.startsWith(item.path);

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`doctor-sidebar__item ${
            isActive ? 'doctor-sidebar__item--active' : ''
          } ${!isOpen ? 'doctor-sidebar__item--collapsed' : ''}`}
          title={!isOpen ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          <div className="doctor-sidebar__item-icon">{item.icon}</div>
          {isOpen && <span className="doctor-sidebar__item-text">{item.label}</span>}
          {item.badge !== undefined && (
            <span
              className={`doctor-sidebar__badge ${
                isActive ? 'doctor-sidebar__badge--active' : ''
              }`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      );
    },
    [isOpen, location.pathname]
  );

  return (
    <aside
      className={`doctor-sidebar ${!isOpen ? 'doctor-sidebar--collapsed' : ''}`}
      aria-label="Doctor Portal Navigation"
    >
      {/* Top Header / Brand Logo */}
      <div className={`doctor-sidebar__header ${!isOpen ? 'doctor-sidebar__header--collapsed' : ''}`}>
        {isOpen ? (
          <>
            <div className="doctor-sidebar__brand-area">
              <BrandLogo linkTo={ROUTES.DOCTOR} size="sm" showDivider={false} />
            </div>
            <button
              type="button"
              className="doctor-sidebar__toggle-btn"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} strokeWidth={1.8} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className="doctor-sidebar__expand-btn"
            onClick={onToggle}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <img
              src={feviconImg}
              alt="Jeevayurniketan Emblem"
              className="doctor-sidebar__collapsed-emblem"
            />
            <div className="doctor-sidebar__expand-hint" aria-hidden="true">
              <PanelLeftOpen size={16} strokeWidth={2} />
            </div>
          </button>
        )}
      </div>

      {/* Main Nav Items */}
      <nav className="doctor-sidebar__nav">
        <div className="doctor-sidebar__group">
          {isOpen && <span className="doctor-sidebar__group-title">Clinical</span>}
          <div className="doctor-sidebar__group-list">{clinicalItems.map(renderNavItem)}</div>
        </div>

        <div className="doctor-sidebar__group">
          {isOpen && <span className="doctor-sidebar__group-title">Sanctuary</span>}
          <div className="doctor-sidebar__group-list">{sanctuaryItems.map(renderNavItem)}</div>
        </div>

        <div className="doctor-sidebar__group doctor-sidebar__group--bottom">
          {isOpen && <span className="doctor-sidebar__group-title">Preferences</span>}
          <div className="doctor-sidebar__group-list">{systemItems.map(renderNavItem)}</div>
        </div>
      </nav>

      {/* Doctor Profile Footer */}
      <div className="doctor-sidebar__footer">
        <div
          className={`doctor-sidebar__profile ${!isOpen ? 'doctor-sidebar__profile--collapsed' : ''}`}
          title={!isOpen ? `${doctorName} • Online` : undefined}
        >
          <div className="doctor-sidebar__avatar-wrap">
            <div className="doctor-sidebar__avatar">{doctorInitial}</div>
            <span className="doctor-sidebar__status-dot" title="Active on Duty" />
          </div>

          {isOpen && (
            <div className="doctor-sidebar__profile-info">
              <span className="doctor-sidebar__profile-name">{doctorName}</span>
              <span className="doctor-sidebar__profile-role">Chief Physician</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});

DoctorSidebar.displayName = 'DoctorSidebar';
