import React from 'react';
import './PatientListItemSkeleton.css';

export interface PatientListItemSkeletonProps {
  count?: number;
}

export const PatientListItemSkeleton: React.FC<PatientListItemSkeletonProps> = React.memo(
  ({ count = 6 }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <tr key={idx} className="doctor-patient-row--skeleton">
            <td className="patient-cell patient-cell--number">
              <div className="patient-skeleton-box skeleton-table-number" />
            </td>

            <td className="patient-cell patient-cell--profile">
              <div className="patient-profile-wrapper">
                <div className="patient-skeleton-box skeleton-table-avatar" />
                <div className="skeleton-profile-meta">
                  <div className="patient-skeleton-box skeleton-table-name" />
                  <div className="patient-skeleton-box skeleton-table-id" />
                </div>
              </div>
            </td>

            <td className="patient-cell patient-cell--contact">
              <div className="patient-contact-wrapper">
                <div className="patient-skeleton-box skeleton-table-phone" />
                <div className="patient-skeleton-box skeleton-table-email" />
              </div>
            </td>

            <td className="patient-cell patient-cell--service">
              <div className="patient-service-wrapper">
                <div className="patient-skeleton-box skeleton-table-service" />
                <div className="patient-skeleton-box skeleton-table-format" />
              </div>
            </td>

            <td className="patient-cell patient-cell--concern">
              <div className="patient-skeleton-box skeleton-table-concern" />
            </td>

            <td className="patient-cell patient-cell--status">
              <div className="patient-skeleton-box skeleton-table-pill" />
            </td>

            <td className="patient-cell patient-cell--action">
              <div className="patient-skeleton-box skeleton-table-view-btn" />
            </td>
          </tr>
        ))}
      </>
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
