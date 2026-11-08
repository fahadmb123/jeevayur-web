import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { DoctorSidebar, useDoctorSidebar } from '@/features/doctor/components/DoctorSidebar';
import { DoctorHeader } from '@/features/doctor/components/DoctorHeader';
import { DoctorBottomNav } from '@/features/doctor/components/DoctorBottomNav';
import { usePatients, type Patient } from '@/features/patients';
import { ErrorBoundary } from '@/shared/ui';
import './DoctorLayout.css';

export interface DoctorOutletContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  handleAddPatient: (newPatient: Omit<Patient, 'id'>) => void;
}

export const DoctorLayout: React.FC = React.memo(() => {
  const [isSidebarOpen, toggleSidebar] = useDoctorSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const { addPatient } = usePatients();

  const handleAddPatient = useCallback(
    (newPatient: Omit<Patient, 'id'>) => {
      addPatient(newPatient);
    },
    [addPatient]
  );

  const outletContext = useMemo<DoctorOutletContext>(
    () => ({
      searchQuery,
      setSearchQuery,
      isSidebarOpen,
      toggleSidebar,
      handleAddPatient,
    }),
    [searchQuery, isSidebarOpen, toggleSidebar, handleAddPatient]
  );

  return (
    <div className="doctor-layout doctor-dashboard-layout doctor-page-layout">
      {/* Persistent Sidebar (Mounted Once) */}
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area with Fixed Persistent Header Navbar */}
      <main className="doctor-layout__main doctor-dashboard-main doctor-page-main">
        <DoctorHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        {/* Dynamic Nested Route Content with Contained Smooth Scrolling */}
        <div className="doctor-layout__content-scroll" data-lenis-prevent>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="doctor-layout__loading-container">
                  <div className="doctor-loading-pulse">
                    <div className="doctor-loading-spinner" />
                    <span className="doctor-loading-text">Loading view...</span>
                  </div>
                </div>
              }
            >
              <Outlet context={outletContext} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <DoctorBottomNav />
    </div>
  );
});

DoctorLayout.displayName = 'DoctorLayout';
