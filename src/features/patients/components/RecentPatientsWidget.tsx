import React, { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card } from '@/shared/ui/card';
import { PatientListItem } from './PatientListItem';
import { PatientFilterTabs, type PatientFilterOption } from './PatientFilterTabs';
import { usePatients } from '../hooks/usePatients';
import type { Patient } from '../types';
import './RecentPatientsWidget.css';

export interface RecentPatientsWidgetProps {
  patients?: Patient[];
  onViewAll?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  variants?: Variants;
  searchFilter?: string;
}

export const RecentPatientsWidget: React.FC<RecentPatientsWidgetProps> = React.memo(({
  patients: propPatients,
  onViewAll,
  onSelectPatient,
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
      const matchesSearch = !searchFilter || patient.name.toLowerCase().includes(searchFilter.toLowerCase());
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
          <div>
            <h2 className="recent-patients-widget__title">Recent Patients</h2>
          </div>
          <button className="recent-patients-widget__view-all-btn" onClick={onViewAll}>
            View All
          </button>
        </div>

        <div className="recent-patients-widget__filter-bar">
          <PatientFilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />
        </div>

        <div className="recent-patients-widget__list">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <PatientListItem
                key={patient.id}
                patient={patient}
                index={index}
                onSelect={onSelectPatient}
              />
            ))
          ) : (
            <div className="recent-patients-widget__empty">
              No patients found matching this criteria.
            </div>
          )}
        </div>
      </Card>
    </motion.section>
  );
});

RecentPatientsWidget.displayName = 'RecentPatientsWidget';
