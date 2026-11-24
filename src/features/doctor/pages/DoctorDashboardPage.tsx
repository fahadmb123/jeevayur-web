import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCw, UserPlus, Inbox, Sparkles, CheckCircle2 } from 'lucide-react';
import { DoctorStats } from '../components/DoctorStats/index';
import {
  RecentPatientsWidget,
  PatientDetailModal,
  AddPatientModal,
  usePatients,
  type Patient,
  type PatientStatus,
} from '@/features/patients';
import { TodayScheduleWidget, useAppointments, type Appointment } from '@/features/appointments';
import { useDoctorStats } from '../hooks/useDoctorStats';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  DoctorSearchFilterStrip,
  type FilterSelectConfig,
  type FilterPillConfig,
} from '@/shared/ui/DoctorSearchFilterStrip';
import './DoctorDashboardPage.css';

type DashboardTabFilter = 'all' | 'schedule' | 'patients' | 'uncompleted' | 'completed';

export const DoctorDashboardPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    patients,
    counts: patientCounts,
    fetchPatients,
    addPatient,
    updatePatientStatus,
  } = usePatients();
  const { appointments, refreshAppointments } = useAppointments();
  const { stats, refreshStats } = useDoctorStats();

  const doctorGreetingName = user?.name || 'Dr. Ahalya T.S.';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTabFilter>('all');
  const [selectedSection, setSelectedSection] = useState<'All' | 'Patients' | 'Appointments'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [updatingPatientId, setUpdatingPatientId] = useState<number | string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const timeGreeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const handleSyncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchPatients(),
        refreshAppointments(),
        refreshStats(),
      ]);
      setSuccessBanner('Clinic dashboard synced with live records');
      setTimeout(() => setSuccessBanner(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchPatients, refreshAppointments, refreshStats]);

  const handleTogglePatientStatus = useCallback(
    async (patient: Patient) => {
      const targetStatus: PatientStatus =
        patient.status === 'Completed' ? 'Uncompleted' : 'Completed';
      setUpdatingPatientId(patient.id);
      try {
        await updatePatientStatus(patient.id, targetStatus);
        setSuccessBanner(
          `Patient ${patient.name} marked as ${targetStatus}`
        );
        setTimeout(() => setSuccessBanner(null), 3500);
        refreshStats();
      } finally {
        setUpdatingPatientId(null);
      }
    },
    [updatePatientStatus, refreshStats]
  );

  const handleConsultationFinished = useCallback(
    (apt: Appointment) => {
      setSuccessBanner(`Consultation completed for ${apt.patient}. Clinical records updated.`);
      setTimeout(() => setSuccessBanner(null), 4000);
      refreshStats();
      refreshAppointments();
      fetchPatients();
    },
    [refreshStats, refreshAppointments, fetchPatients]
  );

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
      const matchesPhone = apt.phone ? apt.phone.toLowerCase().includes(q) : false;
      return matchesName || matchesType || matchesPhone;
    });
  }, [appointments, searchQuery]);

  const interactiveStats = useMemo(() => {
    return stats.map((item) => {
      if (item.id === 'today-appointments') {
        return {
          ...item,
          onClick: () => {
            setActiveTab('schedule');
            setSelectedSection('Appointments');
          },
        };
      }
      if (item.id === 'active-treatments') {
        return {
          ...item,
          onClick: () => {
            setActiveTab('completed');
            setSelectedSection('Patients');
          },
        };
      }
      return item;
    });
  }, [stats]);

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

  const pendingRequestsCount = useMemo(() => {
    const statItem = stats.find((s) => s.id === 'consultation-requests');
    if (!statItem) return 0;
    const num = parseInt(statItem.value, 10);
    return isNaN(num) ? 0 : num;
  }, [stats]);

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

  const showPatients =
    selectedSection === 'All' ||
    selectedSection === 'Patients' ||
    activeTab === 'patients' ||
    activeTab === 'uncompleted' ||
    activeTab === 'completed';

  const showSchedule =
    (selectedSection === 'All' ||
      selectedSection === 'Appointments' ||
      activeTab === 'schedule') &&
    activeTab !== 'uncompleted' &&
    activeTab !== 'completed';

  return (
    <div className="doctor-dashboard-content">
      <div className="doctor-dashboard-live-strip">
        <div className="doctor-dashboard-live-indicator">
          <span className="doctor-dashboard-pulse-dot" />
          <span className="doctor-dashboard-live-text">Clinic Active • Live Realtime Feed</span>
          <span className="doctor-dashboard-date-badge">{todayFormatted}</span>
        </div>

        <div className="doctor-dashboard-quick-actions">
          <button
            type="button"
            className={`doctor-dashboard-sync-btn ${isSyncing ? 'is-syncing' : ''}`}
            onClick={handleSyncAll}
            disabled={isSyncing}
            title="Refresh dashboard feed with backend"
          >
            <RotateCw size={14} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
          </button>

          <button
            type="button"
            className="doctor-dashboard-inbound-btn"
            onClick={() => navigate(ROUTES.DOCTOR_REQUESTS)}
          >
            <Inbox size={14} />
            <span>Inbound Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="doctor-dashboard-inbound-badge">{pendingRequestsCount}</span>
            )}
          </button>

          <button
            type="button"
            className="doctor-dashboard-add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={14} />
            <span>+ Add Patient</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="doctor-dashboard-toast">
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="doctor-greeting-section">
        <div className="doctor-greeting-main">
          <h1 className="doctor-greeting-title">
            {timeGreeting}, <span className="doctor-greeting-highlight">{doctorGreetingName}</span>
          </h1>
          <p className="doctor-greeting-sub">
            Reviewing live Ayurvedic sanctuary records, patient appointments, and clinical treatment progress.
          </p>
        </div>
        <div className="doctor-greeting-badge">
          <Sparkles size={15} />
          <span>{patientCounts.All} Registered Patients</span>
        </div>
      </div>

      <DoctorStats stats={interactiveStats} />

      <DoctorSearchFilterStrip
        searchPlaceholder="Search today's patients, appointments, phone numbers or chief complaints..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectFilters={selectFilters}
        onReset={handleReset}
        resetTitle="Reset dashboard filters"
        pills={pills}
      />

      <div
        className="doctor-dashboard-grid"
        style={{
          gridTemplateColumns: showPatients && showSchedule ? undefined : '1fr',
        }}
      >
        {showPatients && (
          <RecentPatientsWidget
            patients={filteredPatients}
            searchFilter={searchQuery}
            onViewAll={() => navigate(ROUTES.DOCTOR_PATIENTS)}
            onViewDetails={(patient) => setDetailPatient(patient)}
            onToggleStatus={handleTogglePatientStatus}
            updatingPatientId={updatingPatientId}
          />
        )}
        {showSchedule && (
          <TodayScheduleWidget
            appointments={filteredAppointments}
            onConsultationComplete={handleConsultationFinished}
            onOpenCalendar={() => navigate(ROUTES.DOCTOR_REQUESTS)}
          />
        )}
      </div>

      <PatientDetailModal
        patient={detailPatient}
        isOpen={Boolean(detailPatient)}
        isLoading={false}
        isStatusUpdating={Boolean(detailPatient && updatingPatientId === detailPatient.id)}
        onClose={() => setDetailPatient(null)}
        onToggleStatus={handleTogglePatientStatus}
      />

      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPatient={async (data) => {
          const created = await addPatient(data);
          setSuccessBanner(`Patient ${created.name} registered successfully`);
          setTimeout(() => setSuccessBanner(null), 3500);
          refreshStats();
          return created;
        }}
      />
    </div>
  );
});

DoctorDashboardPage.displayName = 'DoctorDashboardPage';
