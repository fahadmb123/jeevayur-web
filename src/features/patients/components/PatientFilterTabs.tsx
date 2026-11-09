import React from 'react';
import type { PatientStatus } from '../types';
import './PatientFilterTabs.css';

export type PatientFilterOption = 'All' | PatientStatus;

export interface PatientFilterTabsProps {
  activeFilter: PatientFilterOption;
  onFilterChange: (filter: PatientFilterOption) => void;
  counts?: Partial<Record<PatientFilterOption, number>>;
}

const FILTER_OPTIONS: PatientFilterOption[] = ['All', 'Uncompleted', 'Completed'];

export const PatientFilterTabs: React.FC<PatientFilterTabsProps> = React.memo(({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="patient-filter-tabs">
      {FILTER_OPTIONS.map((option) => {
        const count = counts?.[option];
        const isActive = activeFilter === option;

        return (
          <button
            key={option}
            className={`patient-filter-tab ${isActive ? 'patient-filter-tab--active' : ''}`}
            onClick={() => onFilterChange(option)}
          >
            <span>{option}</span>
            {count !== undefined && (
              <span className="patient-filter-tab__count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
});

PatientFilterTabs.displayName = 'PatientFilterTabs';
