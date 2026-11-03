import React from 'react';
import { Clock } from 'lucide-react';
import type { AyurvedaService } from '../types';

export interface TreatmentImageCardProps {
  service: AyurvedaService;
  isSelected?: boolean;
  onSelect: () => void;
}

export const TreatmentImageCard: React.FC<TreatmentImageCardProps> = React.memo(({
  service,
  isSelected = false,
  onSelect,
}) => {
  return (
    <article
      className={`treatment-image-card ${isSelected ? 'is-selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${service.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="treatment-image-card__media">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="treatment-image-card__img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="treatment-image-card__placeholder">
            <span>{service.icon || '🌿'}</span>
          </div>
        )}

        <div className="treatment-image-card__overlay" />

        <div className="treatment-image-card__content">
          {service.categoryTag && (
            <span className="treatment-image-card__tag">{service.categoryTag}</span>
          )}
          <h3 className="treatment-image-card__title">{service.title}</h3>
          {service.duration && (
            <span className="treatment-image-card__duration">
              <Clock size={12} />
              <span>{service.duration}</span>
            </span>
          )}
        </div>

        {isSelected && (
          <div className="treatment-image-card__selected-badge">
            Selected
          </div>
        )}
      </div>
    </article>
  );
});

TreatmentImageCard.displayName = 'TreatmentImageCard';
