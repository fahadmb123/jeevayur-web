import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  UserPlus,
  Inbox,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Sun,
  Flame,
  Wind,
  Moon,
  Shield,
} from 'lucide-react';
import {
  DoctorStats,
  DoctorQuickRequestsDrawer,
  DoctorTelemetryBar,
  DoctorClinicalInsights,
} from '../components';
import {
  RecentPatientsWidget,
  PatientDetailModal,
  AddPatientModal,
  usePatients,
  type Patient,
  type PatientStatus,
} from '@/features/patients';
import { useDoctorStats } from '../hooks/useDoctorStats';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  DoctorSearchFilterStrip,
  type FilterSelectConfig,
  type FilterPillConfig,
} from '@/shared/ui/DoctorSearchFilterStrip';
import './DoctorDashboardPage.css';

type DashboardTabFilter = 'all' | 'uncompleted' | 'completed';

export const DoctorDashboardPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    patients,
    loading: patientsLoading,
    fetchPatients,
    addPatient,
    updatePatientStatus,
  } = usePatients();
  const {
    stats,
    loading: statsLoading,
    refreshStats,
  } = useDoctorStats();

  const doctorGreetingName = user?.name || 'Dr. Ahalya T.S.';

  const doctorInitials = useMemo(() => {
    return doctorGreetingName
      .split(' ')
      .map((part) => part.replace(/[^a-zA-Z]/g, ''))
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'DR';
  }, [doctorGreetingName]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTabFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState<boolean>(false);
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

  const doshaMetrics = useMemo(() => {
    let vata = 0;
    let pitta = 0;
    let kapha = 0;

    patients.forEach((p) => {
      const cond = (p.condition || '').toLowerCase();
      if (
        cond.includes('joint') ||
        cond.includes('arthrit') ||
        cond.includes('nerve') ||
        cond.includes('insomnia') ||
        cond.includes('stress') ||
        cond.includes('pain') ||
        cond.includes('anxiety')
      ) {
        vata += 2;
      } else if (
        cond.includes('digest') ||
        cond.includes('skin') ||
        cond.includes('acid') ||
        cond.includes('liver') ||
        cond.includes('burn') ||
        cond.includes('inflam')
      ) {
        pitta += 2;
      } else if (
        cond.includes('respirat') ||
        cond.includes('asthma') ||
        cond.includes('weight') ||
        cond.includes('sinus') ||
        cond.includes('letharg')
      ) {
        kapha += 2;
      } else {
        vata += 1;
        pitta += 1;
        kapha += 1;
      }
    });

    const total = vata + pitta + kapha || 1;
    const vataPct = Math.round((vata / total) * 100);
    const pittaPct = Math.round((pitta / total) * 100);
    const kaphaPct = Math.max(10, 100 - vataPct - pittaPct);

    return {
      vata: Math.max(15, vataPct),
      pitta: Math.max(15, pittaPct),
      kapha: kaphaPct,
    };
  }, [patients]);

  const circadianPhase = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) {
      return {
        phase: 'Kapha Synthesis',
        timeRange: '06:00 - 10:00',
        focus: 'Vyayama (Therapeutic Movement) & Respiratory Detoxification',
        icon: Sun,
      };
    }
    if (hour >= 10 && hour < 14) {
      return {
        phase: 'Pitta Solar Peak',
        timeRange: '10:00 - 14:00',
        focus: 'Optimal Jatharagni (Metabolic Strength) & Active Clinical Formulations',
        icon: Flame,
      };
    }
    if (hour >= 14 && hour < 18) {
      return {
        phase: 'Vata Movement',
        timeRange: '14:00 - 18:00',
        focus: 'Nadi Pariksha, Herbal Decoctions & Patient Dosha Reassessment',
        icon: Wind,
      };
    }
    if (hour >= 18 && hour < 22) {
      return {
        phase: 'Kapha Rest & Assimilation',
        timeRange: '18:00 - 22:00',
        focus: 'Warm Abhyanga, Light Pathya Ahara & Dosha Equilibrium',
        icon: Moon,
      };
    }
    return {
      phase: 'Brahma Muhurta Rejuvenation',
      timeRange: '22:00 - 06:00',
      focus: 'Rasayana Cellular Repair, Tissue Regeneration & Deep Sanctuary Rest',
      icon: Shield,
    };
  }, []);

  const handleSyncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchPatients(),
        refreshStats(),
      ]);
      setSuccessBanner('Clinical dashboard synchronized with Turso Edge database');
      setTimeout(() => setSuccessBanner(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchPatients, refreshStats]);

  const handleExportCSV = useCallback(() => {
    if (patients.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Gender', 'Condition', 'Source', 'Status'];
    const rows = patients.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.phone || ''}"`,
      `"${p.gender || ''}"`,
      `"${(p.condition || '').replace(/"/g, '""')}"`,
      `"${p.source || 'doctor'}"`,
      `"${p.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jeevayur_patient_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccessBanner(`Exported ${patients.length} patient records to CSV`);
    setTimeout(() => setSuccessBanner(null), 3000);
  }, [patients]);

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

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
    setSelectedStatus('All');
    setSelectedSource('All');
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
      if (activeTab === 'uncompleted' && patient.status === 'Completed') return false;
      if (activeTab === 'completed' && patient.status !== 'Completed') return false;

      if (selectedStatus === 'Uncompleted' && patient.status === 'Completed') return false;
      if (selectedStatus === 'Completed' && patient.status !== 'Completed') return false;

      if (selectedSource !== 'All' && patient.source !== selectedSource) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = patient.name.toLowerCase().includes(q);
        const matchesCondition = patient.condition ? patient.condition.toLowerCase().includes(q) : false;
        const matchesPhone = patient.phone ? patient.phone.toLowerCase().includes(q) : false;
        return matchesName || matchesCondition || matchesPhone;
      }

      return true;
    });
  }, [patients, activeTab, selectedStatus, selectedSource, searchQuery]);

  const interactiveStats = useMemo(() => {
    return stats.map((item) => {
      if (item.id === 'consultation-requests') {
        return {
          ...item,
          link: undefined,
          onClick: () => setIsRequestsDrawerOpen(true),
        };
      }
      if (item.id === 'total-patients') {
        return {
          ...item,
          onClick: () => {
            setActiveTab('all');
            setSelectedStatus('All');
            setSelectedSource('All');
          },
        };
      }
      if (item.id === 'active-patients') {
        return {
          ...item,
          onClick: () => {
            setActiveTab('uncompleted');
            setSelectedStatus('Uncompleted');
          },
        };
      }
      if (item.id === 'active-treatments') {
        return {
          ...item,
          onClick: () => {
            setActiveTab('completed');
            setSelectedStatus('Completed');
          },
        };
      }
      return item;
    });
  }, [stats]);

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'status-filter',
      value: selectedStatus,
      ariaLabel: 'Filter by clinical status',
      onChange: setSelectedStatus,
      options: [
        { value: 'All', label: 'All Statuses' },
        { value: 'Uncompleted', label: 'Active in Care' },
        { value: 'Completed', label: 'Therapy Concluded' },
      ],
    },
    {
      id: 'source-filter',
      value: selectedSource,
      ariaLabel: 'Filter by patient source',
      onChange: setSelectedSource,
      options: [
        { value: 'All', label: 'All Sources' },
        { value: 'website', label: 'Website Bookings' },
        { value: 'doctor', label: 'Doctor Added' },
      ],
    },
  ], [selectedStatus, selectedSource]);

  const pendingRequestsCount = useMemo(() => {
    const statItem = stats.find((s) => s.id === 'consultation-requests');
    if (!statItem) return 0;
    const num = parseInt(statItem.value, 10);
    return isNaN(num) ? 0 : num;
  }, [stats]);

  const pills: FilterPillConfig[] = useMemo(() => [
    {
      id: 'all',
      label: 'All Patients',
      count: patients.length,
      isActive: activeTab === 'all' && selectedStatus === 'All',
      onClick: () => {
        setActiveTab('all');
        setSelectedStatus('All');
      },
    },
    {
      id: 'uncompleted',
      label: 'Active in Care',
      count: uncompletedCount,
      isActive: activeTab === 'uncompleted' || selectedStatus === 'Uncompleted',
      onClick: () => {
        setActiveTab('uncompleted');
        setSelectedStatus('Uncompleted');
      },
    },
    {
      id: 'completed',
      label: 'Completed Therapies',
      count: completedCount,
      isActive: activeTab === 'completed' || selectedStatus === 'Completed',
      onClick: () => {
        setActiveTab('completed');
        setSelectedStatus('Completed');
      },
    },
  ], [activeTab, selectedStatus, patients.length, uncompletedCount, completedCount]);

  const CircadianIcon = circadianPhase.icon;

  return (
    <div className="doctor-dashboard-content">
      {successBanner && (
        <div className="doctor-dashboard-toast">
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="doctor-modern-hero">
        <div className="doctor-modern-hero__pattern" />
        <div className="doctor-modern-hero__left">
          <div className="doctor-modern-hero__avatar-box">
            <div className="doctor-modern-hero__avatar">
              <span>{doctorInitials}</span>
            </div>
            <span className="doctor-modern-hero__status-ring" title="Clinical desk active" />
          </div>

          <div className="doctor-modern-hero__details">
            <div className="doctor-modern-hero__meta-pill-row">
              <span className="doctor-modern-hero__pulse-pill">
                <span className="doctor-modern-hero__pulse-dot" />
                <span>Live Sanctuary Feed</span>
              </span>
              <span className="doctor-modern-hero__date-pill">
                <Calendar size={12} />
                <span>{todayFormatted}</span>
              </span>
              <span className="doctor-modern-hero__ritu-pill">
                <Sparkles size={12} />
                <span>Hemanta Ritu • Vata Pacification</span>
              </span>
            </div>

            <h1 className="doctor-modern-hero__title">
              {timeGreeting}, <span className="doctor-modern-hero__title-accent">{doctorGreetingName}</span>
            </h1>

            <p className="doctor-modern-hero__subtitle">
              Ayurvedic Sanctuary Clinical Command Center • Classical Panchakarma, Patient Records & Real-Time Telemetry
            </p>
          </div>
        </div>

        <div className="doctor-modern-hero__actions">
          <button
            type="button"
            className={`doctor-hero-btn doctor-hero-btn--sync ${isSyncing ? 'is-syncing' : ''}`}
            onClick={handleSyncAll}
            disabled={isSyncing}
            title="Synchronize records with live database"
          >
            <RotateCw size={14} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
          </button>

          <button
            type="button"
            className="doctor-hero-btn doctor-hero-btn--inbound"
            onClick={() => setIsRequestsDrawerOpen(true)}
          >
            <Inbox size={15} />
            <span>Inbound Triage</span>
            {pendingRequestsCount > 0 && (
              <span className="doctor-hero-btn__badge">{pendingRequestsCount}</span>
            )}
          </button>

          <button
            type="button"
            className="doctor-hero-btn doctor-hero-btn--primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={15} />
            <span>+ Add Patient</span>
          </button>
        </div>
      </div>

      <DoctorTelemetryBar
        patientCount={patients.length}
        isSyncing={isSyncing}
        onSync={handleSyncAll}
        onExportCSV={handleExportCSV}
      />

      <DoctorStats stats={interactiveStats} loading={statsLoading || isSyncing} />

      <DoctorClinicalInsights
        doshaMetrics={doshaMetrics}
        activeCount={uncompletedCount}
        completedCount={completedCount}
        totalCount={patients.length}
        onFilterActive={() => {
          setActiveTab('uncompleted');
          setSelectedStatus('Uncompleted');
        }}
        onFilterCompleted={() => {
          setActiveTab('completed');
          setSelectedStatus('Completed');
        }}
      />

      <DoctorSearchFilterStrip
        searchPlaceholder="Search patients by name, contact, health condition, or service..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectFilters={selectFilters}
        onReset={handleReset}
        resetTitle="Reset dashboard filters"
        pills={pills}
        isLoading={patientsLoading || statsLoading || isSyncing}
      />

      <div className="doctor-dashboard-main">
        <RecentPatientsWidget
          patients={filteredPatients}
          isLoading={patientsLoading || isSyncing}
          searchFilter={searchQuery}
          onViewAll={() => navigate(ROUTES.DOCTOR_PATIENTS)}
          onViewDetails={(patient) => setDetailPatient(patient)}
          onToggleStatus={handleTogglePatientStatus}
          onAddPatient={() => setIsAddModalOpen(true)}
          updatingPatientId={updatingPatientId}
        />

        <div className="doctor-dinacharya-card doctor-dinacharya-card--horizontal">
          <div className="doctor-dinacharya-card__header">
            <div className="doctor-dinacharya-card__icon-wrap">
              <Compass size={18} />
            </div>
            <div>
              <div className="doctor-dinacharya-card__title-row">
                <h3 className="doctor-dinacharya-card__title">Ayurvedic Sanctuary Protocols</h3>
                <span className="doctor-dinacharya-card__phase-chip">
                  <CircadianIcon size={12} />
                  <span>{circadianPhase.phase.toUpperCase()} · {circadianPhase.timeRange}</span>
                </span>
              </div>
              <span className="doctor-dinacharya-card__sub">{circadianPhase.focus}</span>
            </div>
          </div>

          <div className="doctor-dinacharya-card__body doctor-dinacharya-card__body--grid">
            <div className="doctor-dinacharya-item">
              <ShieldCheck size={14} className="doctor-dinacharya-item__icon" />
              <div>
                <strong>Dosha Assessment Focus</strong>
                <p>Screening Vata imbalance, sleep rhythm disturbances, and digestive Agni weakness.</p>
              </div>
            </div>

            <div className="doctor-dinacharya-item">
              <HeartPulse size={14} className="doctor-dinacharya-item__icon" />
              <div>
                <strong>Prescription Formulations</strong>
                <p>Brahmi Thailam Shirodhara, warm Mahanarayan Abhyanga, and customized herbal decoctions.</p>
              </div>
            </div>
          </div>

          <div className="doctor-dinacharya-card__footer">
            <button
              type="button"
              className="doctor-dinacharya-btn"
              onClick={() => navigate(ROUTES.DOCTOR_YOGA)}
            >
              <span>Yoga & Meditation Timetable</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <DoctorQuickRequestsDrawer
        isOpen={isRequestsDrawerOpen}
        onClose={() => setIsRequestsDrawerOpen(false)}
        onAccepted={(req) => {
          handleSyncAll();
          setSuccessBanner(`Accepted consultation request for ${req.patientName}`);
          setTimeout(() => setSuccessBanner(null), 3500);
        }}
      />

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
