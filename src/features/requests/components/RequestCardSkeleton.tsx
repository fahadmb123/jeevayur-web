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
            <div className="consult-card__header">
              <div className="consult-card__patient">
                <div className="skeleton-box skeleton-avatar" />
                <div className="skeleton-user-meta">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-subtitle" />
                </div>
              </div>
              <div className="consult-card__header-right">
                <div className="skeleton-box skeleton-pill" />
                <div className="skeleton-box skeleton-time" />
              </div>
            </div>

            <div className="consult-card__spec-strip">
              <div className="skeleton-box skeleton-badge skeleton-badge--lg" />
              <div className="skeleton-box skeleton-badge skeleton-badge--sm" />
            </div>

            <div className="consult-card__inquiry-card skeleton-inquiry-box">
              <div className="skeleton-box skeleton-text-p1" />
              <div className="skeleton-box skeleton-text-p2" />
            </div>

            <div className="consult-card__footer">
              <div className="skeleton-box skeleton-btn skeleton-btn--details" />
              <div className="consult-card__actions-group">
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
    <div className="doctor-consult-stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="doctor-consult-stat-card skeleton-stat-card">
          <div className="skeleton-box skeleton-stat-icon" />
          <div className="skeleton-stat-info">
            <div className="skeleton-box skeleton-stat-label" />
            <div className="skeleton-box skeleton-stat-value" />
          </div>
        </div>
      ))}
    </div>
  );
});

RequestStatsSkeleton.displayName = 'RequestStatsSkeleton';
