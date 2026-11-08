import React from 'react';
import './PatientListItemSkeleton.css';

export interface PatientListItemSkeletonProps {
  count?: number;
}

export const PatientListItemSkeleton: React.FC<PatientListItemSkeletonProps> = React.memo(
  ({ count = 6 }) => {
    return (
      <div className="patient-skeletons-wrapper" role="status" aria-label="Loading patients">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="patient-list-item--skeleton">
            <div className="skeleton-patient-info">
              <div className="patient-skeleton-box skeleton-patient-avatar" />
              <div className="skeleton-patient-details">
                <div className="patient-skeleton-box skeleton-patient-name" />
                <div className="patient-skeleton-box skeleton-patient-meta" />
              </div>
            </div>
            <div className="skeleton-patient-status-wrap">
              <div className="patient-skeleton-box skeleton-patient-pill" />
              <div className="patient-skeleton-box skeleton-patient-action" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

PatientListItemSkeleton.displayName = 'PatientListItemSkeleton';

export const PatientStatsSkeleton: React.FC = React.memo(() => {
  return (
    <div className="doctor-patient-stats-grid" role="status" aria-label="Loading patient statistics">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="doctor-patient-stat-card doctor-patient-stat-card--skeleton">
          <div className="patient-skeleton-box skeleton-patient-stat-icon" />
          <div className="skeleton-patient-stat-info">
            <div className="patient-skeleton-box skeleton-patient-stat-label" />
            <div className="patient-skeleton-box skeleton-patient-stat-value" />
          </div>
        </div>
      ))}
    </div>
  );
});

PatientStatsSkeleton.displayName = 'PatientStatsSkeleton';
