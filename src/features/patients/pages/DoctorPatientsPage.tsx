import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { DoctorSearchFilterStrip, type FilterSelectConfig, type FilterPillConfig } from '@/shared/ui/DoctorSearchFilterStrip';
import { PatientListItem } from '../components/PatientListItem';
import { PatientListItemSkeleton } from '../components/PatientListItemSkeleton';
import { PatientDetailModal } from '../components/PatientDetailModal';
import { AddPatientModal } from '../components/AddPatientModal';
import { usePatients } from '../hooks/usePatients';
import type { Patient } from '../types';
import type { PatientFilterOption } from '../components/PatientFilterTabs';
import './DoctorPatientsPage.css';

export const DoctorPatientsPage: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<PatientFilterOption>('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [limit] = useState(50);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState<string | number | null>(null);
  const [updatingPatientId, setUpdatingPatientId] = useState<string | number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: activeStatus,
    gender: selectedGender,
    source: selectedSource,
    limit,
  }), [debouncedSearch, activeStatus, selectedGender, selectedSource, limit]);

  const { patients, counts, loading, addPatient, updatePatientStatus } = usePatients(queryParams);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
    setActiveStatus('All');
    setSelectedGender('All');
    setSelectedSource('All');
  }, []);

  const handleViewDetails = useCallback((patient: Patient) => {
    setViewingPatientId(patient.id);
    setDetailPatient(patient);
    setIsDetailLoading(true);
    const timer = setTimeout(() => {
      setIsDetailLoading(false);
      setViewingPatientId(null);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleStatus = useCallback(
    async (patient: Patient) => {
      if (updatingPatientId !== null) return;
      setUpdatingPatientId(patient.id);
      try {
        const nextStatus = patient.status === 'Completed' ? 'Uncompleted' : 'Completed';
        await updatePatientStatus(patient.id, nextStatus);
        setDetailPatient((prev) => (prev?.id === patient.id ? { ...prev, status: nextStatus } : prev));
      } finally {
        setUpdatingPatientId(null);
      }
    },
    [updatePatientStatus, updatingPatientId]
  );

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'source-filter',
      value: selectedSource,
      ariaLabel: 'Filter by patient source',
      onChange: setSelectedSource,
      options: [
        { label: 'All Sources', value: 'All' },
        { label: 'Website Booking', value: 'website' },
        { label: 'Added by Doctor', value: 'doctor' },
      ],
    },
    {
      id: 'status-filter',
      value: activeStatus,
      ariaLabel: 'Filter by patient status',
      onChange: (val) => setActiveStatus(val as PatientFilterOption),
      options: [
        { label: 'All Statuses', value: 'All' },
        { label: 'Uncompleted', value: 'Uncompleted' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    {
      id: 'gender-filter',
      value: selectedGender,
      ariaLabel: 'Filter by gender',
      onChange: setSelectedGender,
      options: [
        { label: 'All Genders', value: 'All' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
      ],
    },
  ], [activeStatus, selectedGender, selectedSource]);

  const pills: FilterPillConfig[] = useMemo(() => [
    {
      id: 'all',
      label: 'All Patients',
      count: counts.All,
      isActive: activeStatus === 'All',
      onClick: () => setActiveStatus('All'),
    },
    {
      id: 'uncompleted',
      label: 'Uncompleted',
      count: counts.Uncompleted,
      isActive: activeStatus === 'Uncompleted',
      onClick: () => setActiveStatus('Uncompleted'),
    },
    {
      id: 'completed',
      label: 'Completed',
      count: counts.Completed,
      isActive: activeStatus === 'Completed',
      onClick: () => setActiveStatus('Completed'),
    },
  ], [activeStatus, counts]);

  return (
    <div className="doctor-page-content">
      <div className="doctor-patient-header-row">
        <div className="doctor-patient-title-wrap">
          <div className="doctor-patient-title-badge-row">
            <h2 className="doctor-patient-page-title">Patient Records</h2>
            <span className="doctor-patient-total-badge">{counts.All} Total</span>
          </div>
          <span className="doctor-patient-page-sub">
            Manage classical Ayurveda clinical records and active patients
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="doctor-patient-add-btn"
        >
          <UserPlus size={16} />
          <span>Add Patient</span>
        </button>
      </div>

      <DoctorSearchFilterStrip
        searchPlaceholder="Search patients by name, condition, or contact..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectFilters={selectFilters}
        onReset={handleReset}
        resetTitle="Reset patient filters"
        pills={pills}
        isLoading={loading}
      />

      <Card className="doctor-patients-card">
        <div className="doctor-patients-table-container">
          <table className="doctor-patients-table">
            <thead>
              <tr>
                <th className="col-number">#</th>
                <th className="col-patient">Name</th>
                <th className="col-contact">Contact Info</th>
                <th className="col-service">Service &amp; Mode</th>
                <th className="col-concern">Chief Concern</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <PatientListItemSkeleton count={6} />
              ) : patients.length > 0 ? (
                patients.map((patient, index) => (
                  <PatientListItem
                    key={patient.id}
                    patient={patient}
                    index={index}
                    onViewDetails={handleViewDetails}
                    onToggleStatus={handleToggleStatus}
                    isStatusUpdating={updatingPatientId === patient.id}
                    isDetailLoading={viewingPatientId === patient.id && isDetailLoading}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="doctor-patients-empty">
                    No patient records match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <PatientDetailModal
        patient={detailPatient}
        isOpen={Boolean(detailPatient)}
        isLoading={isDetailLoading}
        isStatusUpdating={Boolean(detailPatient && updatingPatientId === detailPatient.id)}
        onClose={() => setDetailPatient(null)}
        onToggleStatus={handleToggleStatus}
      />

      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPatient={addPatient}
      />
    </div>
  );
});

DoctorPatientsPage.displayName = 'DoctorPatientsPage';
