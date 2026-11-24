import React, { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Users, UserPlus, ArrowRight } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { PatientListItem } from '../PatientListItem';
import { PatientFilterTabs, type PatientFilterOption } from '../PatientFilterTabs';
import { usePatients } from '../../hooks/usePatients';
import type { Patient } from '../../types';
import './RecentPatientsWidget.css';

export interface RecentPatientsWidgetProps {
  patients?: Patient[];
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
  onViewAll,
  onSelectPatient,
  onViewDetails,
  onToggleStatus,
  onAddPatient,
  updatingPatientId,
  variants,
  searchFilter = '',
}) => {
  const { patients: hookPatients } = usePatients();
  const patients = propPatients || hookPatients;

  const [activeFilter, setActiveFilter] = useState<PatientFilterOption>('All');

  const handleFilterChange = React.useCallback((filter: PatientFilterOption) => {
    setActiveFilter(filter);
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesStatus = activeFilter === 'All' || patient.status === activeFilter;
      const matchesSearch =
        !searchFilter ||
        patient.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (patient.condition ? patient.condition.toLowerCase().includes(searchFilter.toLowerCase()) : false) ||
        (patient.phone ? patient.phone.toLowerCase().includes(searchFilter.toLowerCase()) : false);
      return matchesStatus && matchesSearch;
    });
  }, [patients, activeFilter, searchFilter]);

  const counts = useMemo(() => {
    return {
      All: patients.length,
      Uncompleted: patients.filter((p) => p.status !== 'Completed').length,
      Completed: patients.filter((p) => p.status === 'Completed').length,
    };
  }, [patients]);

  return (
    <motion.section variants={variants} className="recent-patients-widget">
      <Card className="recent-patients-widget__card">
        <div className="recent-patients-widget__header">
          <div className="recent-patients-widget__header-info">
            <div className="recent-patients-widget__title-row">
              <h2 className="recent-patients-widget__title">Recent Patients</h2>
              <span className="recent-patients-widget__badge">
                {filteredPatients.length} Active
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

        <div className="recent-patients-widget__filter-bar">
          <PatientFilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />
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
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
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
