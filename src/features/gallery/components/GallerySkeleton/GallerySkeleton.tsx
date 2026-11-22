import React from 'react';
import './GallerySkeleton.css';

export interface GallerySkeletonProps {
  count?: number;
}

export const GalleryCardSkeleton: React.FC<GallerySkeletonProps> = React.memo(
  ({ count = 6 }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="doctor-gallery-card doctor-gallery-card--skeleton"
            aria-hidden="true"
          >
            <div className="doctor-gallery-card__image-container doctor-gallery-skeleton-media gallery-skeleton-box">
              <div className="gallery-skeleton-badge gallery-skeleton-box" />
            </div>

            <div className="doctor-gallery-card__info">
              <div className="doctor-gallery-card__title-row">
                <div className="gallery-skeleton-title gallery-skeleton-box" />
                <div className="gallery-skeleton-actions">
                  <div className="gallery-skeleton-action-btn gallery-skeleton-box" />
                  <div className="gallery-skeleton-action-btn gallery-skeleton-box" />
                </div>
              </div>

              <div className="gallery-skeleton-desc-group">
                <div className="gallery-skeleton-desc-line gallery-skeleton-desc-line--full gallery-skeleton-box" />
                <div className="gallery-skeleton-desc-line gallery-skeleton-desc-line--short gallery-skeleton-box" />
              </div>

              <div className="doctor-gallery-card__footer-meta gallery-skeleton-footer-meta">
                <div className="gallery-skeleton-meta-item gallery-skeleton-box" />
                <div className="gallery-skeleton-meta-item gallery-skeleton-meta-item--author gallery-skeleton-box" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
);

GalleryCardSkeleton.displayName = 'GalleryCardSkeleton';

export const GalleryGridSkeleton: React.FC<GallerySkeletonProps> = React.memo(
  ({ count = 6 }) => {
    return (
      <div
        className="doctor-gallery-page__grid doctor-gallery-page__grid--skeleton"
        role="status"
        aria-label="Loading gallery images"
      >
        <GalleryCardSkeleton count={count} />
      </div>
    );
  }
);

GalleryGridSkeleton.displayName = 'GalleryGridSkeleton';
