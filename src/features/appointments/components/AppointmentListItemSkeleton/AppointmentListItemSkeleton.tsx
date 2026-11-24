import React from 'react';
import './AppointmentListItemSkeleton.css';

export interface AppointmentListItemSkeletonProps {
  count?: number;
}

export const AppointmentListItemSkeleton: React.FC<AppointmentListItemSkeletonProps> = React.memo(({ count = 3 }) => {
  return (
    <div className="appointment-skeleton-list" role="status" aria-label="Loading appointments">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="appointment-item appointment-item--skeleton">
          <div className="appointment-item__time-block">
            <div className="appointment-skeleton-box skeleton-time-main" />
            <div className="appointment-skeleton-box skeleton-time-sub" />
          </div>

          <div className="appointment-item__details">
            <div className="appointment-item__header-row">
              <div className="appointment-skeleton-box skeleton-patient-name" />
              <div className="appointment-skeleton-box skeleton-video-pill" />
            </div>
            <div className="appointment-skeleton-box skeleton-service-type" />
          </div>

          <div className="appointment-item__actions-col">
            <div className="appointment-skeleton-box skeleton-start-btn" />
          </div>
        </div>
      ))}
    </div>
  );
});

AppointmentListItemSkeleton.displayName = 'AppointmentListItemSkeleton';
