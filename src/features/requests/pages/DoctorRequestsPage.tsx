import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Users,
  Check,
} from 'lucide-react';
import { Card } from '@/shared/ui/card';
import {
  DoctorSearchFilterStrip,
  type FilterSelectConfig,
  type FilterPillConfig,
} from '@/shared/ui/DoctorSearchFilterStrip';
import { useRequests } from '../hooks/useRequests';
import { RequestCard } from '../components/RequestCard';
import { RequestCardSkeleton } from '../components/RequestCardSkeleton';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { RejectReasonModal } from '../components/RejectReasonModal';
import { AcceptConfirmModal } from '../components/AcceptConfirmModal';
import type { PatientRequest, RequestFilterOption } from '../types';
import { ROUTES } from '@/shared/config/routes';
import './DoctorRequestsPage.css';

export const DoctorRequestsPage: React.FC = React.memo(() => {
  const {
    requests,
    loading,
    pendingCount,
    acceptedCount,
    rejectedCount,
    acceptRequest,
    rejectRequest,
  } = useRequests();

  const [activeFilter, setActiveFilter] = useState<RequestFilterOption>('Pending');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const [detailRequest, setDetailRequest] = useState<PatientRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<PatientRequest | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<PatientRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const handleOpenAccept = useCallback((req: PatientRequest) => {
    setAcceptingRequest(req);
  }, []);

  const handleCloseAccept = useCallback(() => {
    setAcceptingRequest(null);
  }, []);

  const handleConfirmAccept = useCallback(
    async (req: PatientRequest) => {
      try {
        setIsProcessing(true);
        await acceptRequest(req.id);
        setAcceptingRequest(null);
        setDetailRequest((prev) => (prev?.id === req.id ? null : prev));
        showToast(`Request accepted! ${req.patientName} has been enrolled into your patient directory.`);
      } catch {
      } finally {
        setIsProcessing(false);
      }
    },
    [acceptRequest, showToast]
  );

  const handleOpenReject = useCallback((req: PatientRequest) => {
    setRejectingRequest(req);
  }, []);

  const handleConfirmReject = useCallback(
    async (req: PatientRequest, reason: string) => {
      try {
        setIsProcessing(true);
        await rejectRequest(req.id, reason);
        setRejectingRequest(null);
        setDetailRequest((prev) => (prev?.id === req.id ? null : prev));
        showToast(`Request for ${req.patientName} was declined.`);
      } catch {
      } finally {
        setIsProcessing(false);
      }
    },
    [rejectRequest, showToast]
  );

  const handleViewDetails = useCallback((req: PatientRequest) => {
    setDetailRequest(req);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailRequest(null);
  }, []);

  const handleCloseReject = useCallback(() => {
    setRejectingRequest(null);
  }, []);

  const handleReset = useCallback(() => {
    setLocalSearch('');
    setActiveFilter('Pending');
    setSelectedService('All');
    setSelectedMode('All');
  }, []);

  const servicesList = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => set.add(r.service));
    return ['All', ...Array.from(set)];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (activeFilter === 'Pending' && r.status !== 'pending') return false;
      if (activeFilter === 'Accepted' && r.status !== 'accepted') return false;
      if (activeFilter === 'Rejected' && r.status !== 'rejected') return false;

      if (selectedService !== 'All' && r.service !== selectedService) return false;

      if (selectedMode !== 'All' && r.mode !== selectedMode) return false;

      if (localSearch.trim()) {
        const query = localSearch.toLowerCase().trim();
        const matchesName = r.patientName.toLowerCase().includes(query);
        const matchesPhone = r.phone.toLowerCase().includes(query);
        const matchesEmail = r.email.toLowerCase().includes(query);
        const matchesConcern = r.primaryConcern.toLowerCase().includes(query);
        const matchesService = r.service.toLowerCase().includes(query);
        const matchesLanguage = r.language ? r.language.toLowerCase().includes(query) : false;
        const matchesCity = r.city ? r.city.toLowerCase().includes(query) : false;
        const matchesSymptoms = r.symptoms ? r.symptoms.some((s) => s.toLowerCase().includes(query)) : false;
        return (
          matchesName ||
          matchesPhone ||
          matchesEmail ||
          matchesConcern ||
          matchesService ||
          matchesLanguage ||
          matchesCity ||
          matchesSymptoms
        );
      }

      return true;
    });
  }, [requests, activeFilter, selectedService, selectedMode, localSearch]);

  const counts = useMemo(
    () => ({
      All: requests.length,
      Pending: pendingCount,
      Accepted: acceptedCount,
      Rejected: rejectedCount,
    }),
    [requests.length, pendingCount, acceptedCount, rejectedCount]
  );

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'service-filter',
      value: selectedService,
      ariaLabel: 'Filter by therapy',
      onChange: setSelectedService,
      options: servicesList.map((srv) => ({
        value: srv,
        label: srv === 'All' ? 'All Therapies' : srv,
      })),
    },
    {
      id: 'mode-filter',
      value: selectedMode,
      ariaLabel: 'Filter by consultation mode',
      onChange: setSelectedMode,
      options: [
        { value: 'All', label: 'All Modes' },
        { value: 'In-Person', label: 'In-Person' },
        { value: 'Video Call', label: 'Video Call' },
        { value: 'Phone', label: 'Phone' },
      ],
    },
  ], [selectedService, selectedMode, servicesList]);

  const pills: FilterPillConfig[] = useMemo(() => [
    {
      id: 'all',
      label: 'All Consultations',
      count: counts.All,
      isActive: activeFilter === 'All',
      onClick: () => setActiveFilter('All'),
    },
    {
      id: 'pending',
      label: 'Pending Review',
      count: counts.Pending,
      isActive: activeFilter === 'Pending',
      onClick: () => setActiveFilter('Pending'),
    },
    {
      id: 'accepted',
      label: 'Accepted',
      count: counts.Accepted,
      isActive: activeFilter === 'Accepted',
      onClick: () => setActiveFilter('Accepted'),
    },
    {
      id: 'rejected',
      label: 'Declined',
      count: counts.Rejected,
      isActive: activeFilter === 'Rejected',
      onClick: () => setActiveFilter('Rejected'),
    },
  ], [activeFilter, counts]);

  return (
    <div className="doctor-page-content doctor-consult-page">
      {toastMessage && (
        <div className="doctor-consult-toast" role="alert">
          <Check size={18} className="doctor-consult-toast__icon" />
          <span className="doctor-consult-toast__text">{toastMessage}</span>
          <Link to={ROUTES.DOCTOR_PATIENTS} className="doctor-consult-toast__link">
            View Patients <Users size={14} />
          </Link>
        </div>
      )}

      <div className="doctor-consult-actions-bar">
        <Link to={ROUTES.DOCTOR_PATIENTS} className="doctor-consult-patients-btn">
          <Users size={16} />
          <span>View Registered Patients</span>
        </Link>
      </div>

      <DoctorSearchFilterStrip
        searchPlaceholder="Search patient by name, phone, symptoms, or service..."
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        selectFilters={selectFilters}
        onReset={handleReset}
        resetTitle="Reset request filters"
        pills={pills}
      />

      <Card className="doctor-consult-card">
        <div className="doctor-consult-list">
          {loading ? (
            <RequestCardSkeleton count={3} />
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <RequestCard
                key={request.id}
                request={request}
                index={index}
                onAccept={handleOpenAccept}
                onReject={handleOpenReject}
                onViewDetails={handleViewDetails}
                isProcessing={isProcessing}
              />
            ))
          ) : (
            <div className="doctor-consult-empty">
              <Inbox size={42} className="doctor-consult-empty__icon" />
              <h3 className="doctor-consult-empty__title">No consultations found</h3>
              <p className="doctor-consult-empty__desc">
                {localSearch || selectedService !== 'All' || selectedMode !== 'All'
                  ? 'Try clearing your search or filter options.'
                  : `There are currently no consultations in the "${activeFilter}" tab.`}
              </p>
            </div>
          )}
        </div>
      </Card>

      <RequestDetailModal
        request={detailRequest}
        isOpen={Boolean(detailRequest)}
        onClose={handleCloseDetail}
        onAccept={handleOpenAccept}
        onReject={handleOpenReject}
        isProcessing={isProcessing}
      />

      <AcceptConfirmModal
        request={acceptingRequest}
        isOpen={Boolean(acceptingRequest)}
        onClose={handleCloseAccept}
        onConfirmAccept={handleConfirmAccept}
        isProcessing={isProcessing}
      />

      <RejectReasonModal
        request={rejectingRequest}
        isOpen={Boolean(rejectingRequest)}
        onClose={handleCloseReject}
        onConfirmReject={handleConfirmReject}
        isProcessing={isProcessing}
      />
    </div>
  );
});

DoctorRequestsPage.displayName = 'DoctorRequestsPage';
