import React, { useState, useMemo, useCallback } from 'react';
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
  const { patients, loading, addPatient } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<PatientFilterOption>('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('All');
    setSelectedGender('All');
  }, []);

  const handleViewDetails = useCallback((patient: Patient) => {
    setDetailPatient(patient);
    setIsDetailLoading(true);
    const timer = setTimeout(() => {
      setIsDetailLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesStatus = activeStatus === 'All' || patient.status === activeStatus;
      const matchesGender = selectedGender === 'All' || patient.gender === selectedGender;
      
      if (!matchesStatus || !matchesGender) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchesName = patient.name.toLowerCase().includes(q);
      const matchesCondition = patient.condition ? patient.condition.toLowerCase().includes(q) : false;
      const matchesPhone = patient.phone ? patient.phone.toLowerCase().includes(q) : false;
      const matchesEmail = patient.email ? patient.email.toLowerCase().includes(q) : false;

      return matchesName || matchesCondition || matchesPhone || matchesEmail;
    });
  }, [patients, activeStatus, selectedGender, searchQuery]);

  const counts = useMemo(() => {
    return {
      All: patients.length,
      'In treatment': patients.filter((p) => p.status === 'In treatment').length,
      Recovered: patients.filter((p) => p.status === 'Recovered').length,
      Consultation: patients.filter((p) => p.status === 'Consultation').length,
    };
  }, [patients]);

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'status-filter',
      value: activeStatus,
      ariaLabel: 'Filter by patient status',
      onChange: (val) => setActiveStatus(val as PatientFilterOption),
      options: [
        { label: 'All Statuses', value: 'All' },
        { label: 'In Treatment', value: 'In treatment' },
        { label: 'Recovered', value: 'Recovered' },
        { label: 'Consultation', value: 'Consultation' },
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
  ], [activeStatus, selectedGender]);

  const pills: FilterPillConfig[] = useMemo(() => [
    {
      id: 'all',
      label: 'All Patients',
      count: counts.All,
      isActive: activeStatus === 'All',
      onClick: () => setActiveStatus('All'),
    },
    {
      id: 'in-treatment',
      label: 'In Treatment',
      count: counts['In treatment'],
      isActive: activeStatus === 'In treatment',
      onClick: () => setActiveStatus('In treatment'),
    },
    {
      id: 'consultation',
      label: 'Consultation',
      count: counts.Consultation,
      isActive: activeStatus === 'Consultation',
      onClick: () => setActiveStatus('Consultation'),
    },
    {
      id: 'recovered',
      label: 'Recovered',
      count: counts.Recovered,
      isActive: activeStatus === 'Recovered',
      onClick: () => setActiveStatus('Recovered'),
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
      />

      <Card className="doctor-patients-card">
        <div className="doctor-patients-table-container">
          <table className="doctor-patients-table">
            <thead>
              <tr>
                <th className="col-patient">Patient</th>
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
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <PatientListItem
                    key={patient.id}
                    patient={patient}
                    index={index}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="doctor-patients-empty">
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
        onClose={() => setDetailPatient(null)}
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
