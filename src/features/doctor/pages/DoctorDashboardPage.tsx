import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { DoctorStats } from '../components/DoctorStats/index';
import { RecentPatientsWidget, usePatients } from '@/features/patients';
import { TodayScheduleWidget, useAppointments } from '@/features/appointments';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  DoctorSearchFilterStrip,
  type FilterSelectConfig,
  type FilterPillConfig,
} from '@/shared/ui/DoctorSearchFilterStrip';
import './DoctorDashboardPage.css';

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

type DashboardTabFilter = 'all' | 'schedule' | 'patients' | 'uncompleted' | 'completed';

export const DoctorDashboardPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = usePatients();
  const { appointments } = useAppointments();

  const doctorGreetingName = user?.name || 'Dr. Ahalya T.S.';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTabFilter>('all');
  const [selectedSection, setSelectedSection] = useState<'All' | 'Patients' | 'Appointments'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
    setSelectedSection('All');
    setSelectedStatus('All');
  }, []);

  const uncompletedCount = useMemo(
    () => patients.filter((p) => p.status !== 'Completed').length,
    [patients]
  );

  const completedCount = useMemo(
    () => patients.filter((p) => p.status === 'Completed').length,
    [patients]
  );

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (activeTab === 'uncompleted' && patient.status !== 'Uncompleted') return false;
      if (activeTab === 'completed' && patient.status !== 'Completed') return false;

      if (selectedStatus !== 'All' && patient.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = patient.name.toLowerCase().includes(q);
        const matchesCondition = patient.condition ? patient.condition.toLowerCase().includes(q) : false;
        const matchesPhone = patient.phone ? patient.phone.toLowerCase().includes(q) : false;
        return matchesName || matchesCondition || matchesPhone;
      }

      return true;
    });
  }, [patients, activeTab, selectedStatus, searchQuery]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesName = apt.patient.toLowerCase().includes(q);
      const matchesType = apt.type.toLowerCase().includes(q);
      return matchesName || matchesType;
    });
  }, [appointments, searchQuery]);

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'section-filter',
      value: selectedSection,
      ariaLabel: 'Filter by view section',
      onChange: (val) => setSelectedSection(val as 'All' | 'Patients' | 'Appointments'),
      options: [
        { value: 'All', label: 'All Sections' },
        { value: 'Patients', label: 'Patients Only' },
        { value: 'Appointments', label: 'Schedule Only' },
      ],
    },
    {
      id: 'status-filter',
      value: selectedStatus,
      ariaLabel: 'Filter by clinical status',
      onChange: setSelectedStatus,
      options: [
        { value: 'All', label: 'All Statuses' },
        { value: 'Uncompleted', label: 'Uncompleted' },
        { value: 'Completed', label: 'Completed' },
      ],
    },
  ], [selectedSection, selectedStatus]);

  const pills: FilterPillConfig[] = useMemo(() => [
    {
      id: 'all',
      label: 'Overview (All)',
      count: patients.length + appointments.length,
      isActive: activeTab === 'all',
      onClick: () => {
        setActiveTab('all');
        setSelectedSection('All');
      },
    },
    {
      id: 'schedule',
      label: "Today's Schedule",
      count: appointments.length,
      isActive: activeTab === 'schedule' || selectedSection === 'Appointments',
      onClick: () => {
        setActiveTab('schedule');
        setSelectedSection('Appointments');
      },
    },
    {
      id: 'patients',
      label: 'Recent Patients',
      count: patients.length,
      isActive: activeTab === 'patients' || selectedSection === 'Patients',
      onClick: () => {
        setActiveTab('patients');
        setSelectedSection('Patients');
      },
    },
    {
      id: 'uncompleted',
      label: 'Uncompleted',
      count: uncompletedCount,
      isActive: activeTab === 'uncompleted',
      onClick: () => {
        setActiveTab('uncompleted');
        setSelectedSection('Patients');
      },
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completedCount,
      isActive: activeTab === 'completed',
      onClick: () => {
        setActiveTab('completed');
        setSelectedSection('Patients');
      },
    },
  ], [activeTab, selectedSection, patients.length, appointments.length, uncompletedCount, completedCount]);

  const showPatients = selectedSection === 'All' || selectedSection === 'Patients' || activeTab === 'patients' || activeTab === 'uncompleted' || activeTab === 'completed';
  const showSchedule = (selectedSection === 'All' || selectedSection === 'Appointments' || activeTab === 'schedule') && activeTab !== 'uncompleted' && activeTab !== 'completed';

  return (
    <div className="doctor-dashboard-content">
      <div className="doctor-greeting-section">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="doctor-greeting-title"
        >
          Good Morning, <span className="doctor-greeting-highlight">{doctorGreetingName}</span>
        </motion.h1>
        <p className="doctor-greeting-sub">
          Here is what's happening with your clinic today.
        </p>
      </div>

      <DoctorStats />

      {/* Yoga-style Search & Filter Strip */}
      <DoctorSearchFilterStrip
        searchPlaceholder="Search today's patients, appointments, or medical conditions..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectFilters={selectFilters}
        onReset={handleReset}
        resetTitle="Reset dashboard filters"
        pills={pills}
      />

      <motion.div
        className="doctor-dashboard-grid"
        variants={gridVariants}
        initial="hidden"
        animate="show"
        style={{
          gridTemplateColumns: showPatients && showSchedule ? undefined : '1fr',
        }}
      >
        {showPatients && (
          <RecentPatientsWidget
            patients={filteredPatients}
            searchFilter={searchQuery}
            variants={cardItemVariants}
            onViewAll={() => navigate(ROUTES.DOCTOR_PATIENTS)}
          />
        )}
        {showSchedule && (
          <TodayScheduleWidget
            appointments={filteredAppointments}
            variants={cardItemVariants}
          />
        )}
      </motion.div>
    </div>
  );
});

DoctorDashboardPage.displayName = 'DoctorDashboardPage';
