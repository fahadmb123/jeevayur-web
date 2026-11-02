import React from 'react';
import { Clock, Sparkles, Leaf } from 'lucide-react';
import type { AyurvedaService } from '../types';

export interface TreatmentImageCardProps {
  service: AyurvedaService;
  index?: number;
  onSelect?: () => void;
}

export const TreatmentImageCard: React.FC<TreatmentImageCardProps> = React.memo(({
  service,
  onSelect,
}) => {
  return (
    <article
      className="treatment-image-card"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`View clinical details for ${service.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      <div className="treatment-image-card__media">
        {service.image ? (
          <img
            src={service.image}
            alt={`${service.title} - Classical Ayurvedic treatment`}
            className="treatment-image-card__img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="treatment-image-card__placeholder">
            <Leaf size={44} />
          </div>
        )}

        <div className="treatment-image-card__overlay" />

        {service.categoryTag && (
          <div className="treatment-image-card__tag">
            <span>{service.categoryTag}</span>
          </div>
        )}

        {service.duration && (
          <div className="treatment-image-card__duration">
            <Clock size={12} />
            <span>{service.duration}</span>
          </div>
        )}

        <div className="treatment-image-card__hover-cue">
          <Sparkles size={13} />
          <span>View Clinical Protocol</span>
        </div>
      </div>
    </article>
  );
});

TreatmentImageCard.displayName = 'TreatmentImageCard';
