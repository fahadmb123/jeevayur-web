import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Users, UserPlus, ArrowRight } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { PatientListItem } from '../PatientListItem';
import { PatientListItemSkeleton } from '../PatientListItemSkeleton';
import { usePatients } from '../../hooks/usePatients';
import type { Patient } from '../../types';
import './RecentPatientsWidget.css';

export interface RecentPatientsWidgetProps {
  patients?: Patient[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onViewDetails?: (patient: Patient) => void;
  onToggleStatus?: (patient: Patient) => void;
  onAddPatient?: () => void;
  updatingPatientId?: number | string | null;
  variants?: Variants;
  searchFilter?: string;
}

export const RecentPatientsWidget: React.FC<RecentPatientsWidgetProps> = React.memo(({
  patients: propPatients,
  isLoading: propIsLoading,
  onViewAll,
  onSelectPatient,
  onViewDetails,
  onToggleStatus,
  onAddPatient,
  updatingPatientId,
  variants,
  searchFilter = '',
}) => {
  const { patients: hookPatients, loading: hookLoading } = usePatients();
  const patients = propPatients || hookPatients;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookLoading;

  return (
    <motion.section variants={variants} className="recent-patients-widget">
      <Card className="recent-patients-widget__card">
        <div className="recent-patients-widget__header">
          <div className="recent-patients-widget__header-info">
            <div className="recent-patients-widget__title-row">
              <h2 className="recent-patients-widget__title">Recent Patients</h2>
              <span className="recent-patients-widget__badge">
                {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
              </span>
            </div>
            <span className="recent-patients-widget__subtitle">
              Ayurvedic treatment records, dosha profiles & consultations
            </span>
          </div>
          <button
            type="button"
            className="recent-patients-widget__view-all-btn"
            onClick={onViewAll}
          >
            <span>View All ({patients.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-patients-widget__table-wrap">
          <table className="doctor-patients-table">
            <thead>
              <tr className="doctor-patients-th-row">
                <th className="col-number">#</th>
                <th className="col-patient">Patient Profile</th>
                <th className="col-contact">Contact Info</th>
                <th className="col-service">Service & Mode</th>
                <th className="col-concern">Chief Concern</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <PatientListItemSkeleton count={5} />
              ) : patients.length > 0 ? (
                patients.map((patient, index) => (
                  <PatientListItem
                    key={patient.id}
                    patient={patient}
                    index={index}
                    onSelect={onSelectPatient}
                    onViewDetails={onViewDetails}
                    onToggleStatus={onToggleStatus}
                    isStatusUpdating={updatingPatientId === patient.id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="recent-patients-widget__empty-row">
                    <div className="recent-patients-widget__empty-container">
                      <div className="recent-patients-widget__empty-icon-wrap">
                        <Users size={28} />
                      </div>
                      <h4 className="recent-patients-widget__empty-title">No Patient Records Match</h4>
                      <p className="recent-patients-widget__empty-text">
                        {searchFilter
                          ? `No patient records match the search term "${searchFilter}". Try adjusting your keywords.`
                          : 'Your Ayurvedic clinical patient roster is ready. Register a new patient or review inbound requests.'}
                      </p>
                      {onAddPatient && (
                        <button
                          type="button"
                          className="recent-patients-widget__empty-add-btn"
                          onClick={onAddPatient}
                        >
                          <UserPlus size={14} />
                          <span>+ Register New Patient</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
});

RecentPatientsWidget.displayName = 'RecentPatientsWidget';
