import React from 'react';
import './TreatmentCardSkeleton.css';

export interface TreatmentCardSkeletonProps {
  count?: number;
}

export const TreatmentCardSkeleton: React.FC<TreatmentCardSkeletonProps> = React.memo(
  ({ count = 6 }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <article
            key={idx}
            className="treatment-image-card treatment-image-card--skeleton"
            aria-hidden="true"
          >
            <div className="treatment-image-card__media treatment-image-card__media--skeleton treatment-skeleton-box">
              <div className="treatment-image-card__overlay" />
              <div className="treatment-image-card__content">
                <div className="treatment-skeleton-tag" />
                <div className="treatment-skeleton-title" />
                <div className="treatment-skeleton-duration" />
              </div>
            </div>
          </article>
        ))}
      </>
    );
  }
);

TreatmentCardSkeleton.displayName = 'TreatmentCardSkeleton';

export const TreatmentDetailsCardSkeleton: React.FC = React.memo(() => {
  return (
    <article className="treatment-details-card treatment-details-card--skeleton" aria-hidden="true">
      <div className="treatment-details-card__top">
        <div className="treatment-details-card__badges">
          <div className="treatment-skeleton-box treatment-skeleton-badge treatment-skeleton-badge--cat" />
          <div className="treatment-skeleton-box treatment-skeleton-badge treatment-skeleton-badge--dur" />
        </div>
        <div className="treatment-details-card__nav-arrows">
          <div className="treatment-skeleton-box treatment-skeleton-circle-btn" />
          <div className="treatment-skeleton-box treatment-skeleton-circle-btn" />
        </div>
      </div>

      <div className="treatment-details-card__main">
        <div className="treatment-details-card__body">
          <div className="treatment-skeleton-box treatment-skeleton-h2" />
          <div className="treatment-skeleton-box treatment-skeleton-p treatment-skeleton-p--1" />
          <div className="treatment-skeleton-box treatment-skeleton-p treatment-skeleton-p--2" />
          <div className="treatment-skeleton-box treatment-skeleton-p treatment-skeleton-p--3" />

          <div className="treatment-skeleton-benefits-box">
            <div className="treatment-skeleton-box treatment-skeleton-benefit-head" />
            {[85, 75, 90, 70].map((widthPercent, i) => (
              <div key={i} className="treatment-skeleton-benefit-row">
                <div className="treatment-skeleton-box treatment-skeleton-benefit-check" />
                <div
                  className="treatment-skeleton-box treatment-skeleton-benefit-text"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            ))}
          </div>

          <div className="treatment-details-card__actions">
            <div className="treatment-skeleton-box treatment-skeleton-action-btn treatment-skeleton-action-btn--primary" />
            <div className="treatment-skeleton-box treatment-skeleton-action-btn treatment-skeleton-action-btn--secondary" />
          </div>
        </div>
      </div>

      <div className="treatment-details-card__tabs">
        <div className="treatment-skeleton-box" style={{ width: '110px', height: '14px', borderRadius: '4px' }} />
        <div className="treatment-tabs-scroll">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="treatment-skeleton-box treatment-skeleton-tab-pill"
              style={{ width: `${95 + i * 15}px` }}
            />
          ))}
        </div>
      </div>
    </article>
  );
});

TreatmentDetailsCardSkeleton.displayName = 'TreatmentDetailsCardSkeleton';
