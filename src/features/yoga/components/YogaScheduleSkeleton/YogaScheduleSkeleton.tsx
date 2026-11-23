import React from 'react';
import { useResponsiveSkeletonCount } from '@/shared/lib/useResponsiveSkeletonCount';
import './YogaScheduleSkeleton.css';

export interface YogaTimetableCardSkeletonProps {
  count?: number;
}

export const YogaTimetableCardSkeleton: React.FC<YogaTimetableCardSkeletonProps> = React.memo(
  ({ count: explicitCount }) => {
    const count = useResponsiveSkeletonCount(
      { mobile: 2, tablet: 4, desktop: 8, wide: 12 },
      explicitCount
    );

    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <article key={idx} className="yoga-timetable-card yoga-timetable-card--skeleton" aria-hidden="true">
            <div className="yoga-timetable-card__header">
              <div className="yoga-skeleton-box yoga-skeleton-chip yoga-skeleton-chip--time" />
              <div className="yoga-skeleton-box yoga-skeleton-chip yoga-skeleton-chip--format" />
            </div>

            <div className="yoga-skeleton-box yoga-skeleton-title" />
            <div className="yoga-skeleton-box yoga-skeleton-line yoga-skeleton-line--full" />
            <div className="yoga-skeleton-box yoga-skeleton-line yoga-skeleton-line--short" />

            <div className="yoga-timetable-card__meta">
              <div className="yoga-skeleton-box yoga-skeleton-meta-item" />
              <div className="yoga-skeleton-box yoga-skeleton-meta-item" />
            </div>

            <div className="yoga-timetable-card__footer">
              <div className="yoga-skeleton-box yoga-skeleton-price" />
              <div className="yoga-skeleton-box yoga-skeleton-btn" />
            </div>
          </article>
        ))}
      </>
    );
  }
);

YogaTimetableCardSkeleton.displayName = 'YogaTimetableCardSkeleton';

export interface YogaClassCardSkeletonProps {
  count?: number;
}

export const YogaClassCardSkeleton: React.FC<YogaClassCardSkeletonProps> = React.memo(
  ({ count: explicitCount }) => {
    const count = useResponsiveSkeletonCount(
      { mobile: 2, tablet: 4, desktop: 6, wide: 9 },
      explicitCount
    );

    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <article key={idx} className="yoga-card yoga-card--skeleton" aria-hidden="true">
            <div className="yoga-card__top-bar">
              <div className="yoga-skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '20px' }} />
              <div className="yoga-skeleton-box" style={{ width: '60px', height: '24px', borderRadius: '20px' }} />
            </div>

            <div className="yoga-card__body">
              <div className="yoga-card__header">
                <div className="yoga-skeleton-box" style={{ width: '65%', height: '22px', borderRadius: '6px' }} />
                <div className="yoga-skeleton-box" style={{ width: '40%', height: '14px', borderRadius: '4px', marginTop: '6px' }} />
              </div>

              <div className="yoga-card__days-schedule">
                <div className="yoga-card__days-row">
                  {Array.from({ length: 7 }).map((_, d) => (
                    <div key={d} className="yoga-skeleton-box yoga-skeleton-day-pill" />
                  ))}
                </div>
              </div>

              <div className="yoga-card__meta-tags">
                <div className="yoga-skeleton-box yoga-skeleton-meta-tag" style={{ width: '55%' }} />
                <div className="yoga-skeleton-box yoga-skeleton-meta-tag" style={{ width: '45%' }} />
              </div>

              <div className="yoga-skeleton-box yoga-skeleton-line yoga-skeleton-line--full" />
              <div className="yoga-skeleton-box yoga-skeleton-line yoga-skeleton-line--short" />
            </div>

            <div className="yoga-card__footer">
              <div className="yoga-skeleton-box" style={{ width: '70px', height: '20px', borderRadius: '4px' }} />
              <div className="yoga-skeleton-box yoga-skeleton-admin-btn" />
            </div>
          </article>
        ))}
      </>
    );
  }
);

YogaClassCardSkeleton.displayName = 'YogaClassCardSkeleton';

export interface YogaProgramCardSkeletonProps {
  count?: number;
}

export const YogaProgramCardSkeleton: React.FC<YogaProgramCardSkeletonProps> = React.memo(
  ({ count: explicitCount }) => {
    const count = useResponsiveSkeletonCount(
      { mobile: 2, tablet: 4, desktop: 8, wide: 12 },
      explicitCount
    );

    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <article
            key={idx}
            className="yoga-image-card yoga-image-card--skeleton"
            aria-hidden="true"
          >
            <div className="yoga-image-card__media yoga-skeleton-box">
              <div className="yoga-image-card__content">
                <div className="yoga-skeleton-box" style={{ width: '56px', height: '16px', borderRadius: '4px', marginBottom: '8px' }} />
                <div className="yoga-skeleton-box" style={{ width: '70%', height: '22px', borderRadius: '6px', marginBottom: '6px' }} />
                <div className="yoga-skeleton-box" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
              </div>
            </div>
          </article>
        ))}
      </>
    );
  }
);

YogaProgramCardSkeleton.displayName = 'YogaProgramCardSkeleton';
