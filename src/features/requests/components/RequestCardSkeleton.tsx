import React from 'react';
import './RequestCardSkeleton.css';

export interface RequestCardSkeletonProps {
  count?: number;
}

export const RequestCardSkeleton: React.FC<RequestCardSkeletonProps> = React.memo(
  ({ count = 3 }) => {
    return (
      <div className="request-skeletons-wrapper" role="status" aria-label="Loading appointments">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="consult-card consult-card-skeleton">
            <div className="consult-card__top">
              <div className="consult-card__patient-info">
                <div className="skeleton-box skeleton-avatar" />
                <div className="skeleton-user-meta">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-subtitle" />
                </div>
              </div>
              <div className="consult-card__status-wrap">
                <div className="skeleton-box skeleton-pill" />
                <div className="skeleton-box skeleton-time" />
              </div>
            </div>

            <div className="consult-card__service-schedule skeleton-schedule-strip">
              <div className="consult-card__badge-group">
                <div className="skeleton-box skeleton-badge skeleton-badge--lg" />
                <div className="skeleton-box skeleton-badge skeleton-badge--sm" />
              </div>
              <div className="skeleton-box skeleton-schedule-time" />
            </div>

            <div className="consult-card__concern-box">
              <div className="skeleton-box skeleton-text-p1" />
              <div className="skeleton-box skeleton-text-p2" />
              <div className="consult-card__symptom-tags">
                <div className="skeleton-box skeleton-tag" />
                <div className="skeleton-box skeleton-tag skeleton-tag--wide" />
                <div className="skeleton-box skeleton-tag" />
              </div>
            </div>

            <div className="consult-card__actions">
              <div className="skeleton-box skeleton-btn skeleton-btn--details" />
              <div className="consult-card__action-group">
                <div className="skeleton-box skeleton-btn skeleton-btn--action" />
                <div className="skeleton-box skeleton-btn skeleton-btn--action" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

RequestCardSkeleton.displayName = 'RequestCardSkeleton';

export const RequestStatsSkeleton: React.FC = React.memo(() => {
  return (
    <div className="doctor-consult-stats-grid" role="status" aria-label="Loading statistics">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="doctor-consult-stat-card doctor-consult-stat-card--skeleton">
          <div className="skeleton-box skeleton-stat-icon" />
          <div className="doctor-consult-stat-card__info skeleton-stat-info">
            <div className="skeleton-box skeleton-stat-label" />
            <div className="skeleton-box skeleton-stat-value" />
          </div>
        </div>
      ))}
    </div>
  );
});

RequestStatsSkeleton.displayName = 'RequestStatsSkeleton';

