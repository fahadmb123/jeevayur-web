import React from 'react';
import { Clock, MapPin, Video } from 'lucide-react';
import type { YogaProgram } from '../data/yogaathmaData';

export interface YogaProgramImageCardProps {
  program: YogaProgram;
  isSelected?: boolean;
  onSelect: () => void;
}

export const YogaProgramImageCard: React.FC<YogaProgramImageCardProps> = React.memo(({
  program,
  isSelected = false,
  onSelect,
}) => {
  const isOnline = program.format.toLowerCase().includes('online');

  return (
    <article
      className={`yoga-image-card ${isSelected ? 'is-selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${program.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="yoga-image-card__media">
        <img
          src={program.image}
          alt={program.title}
          className="yoga-image-card__img"
          loading="lazy"
          decoding="async"
        />
        <div className="yoga-image-card__overlay" />

        <div className="yoga-image-card__top">
          <span className="yoga-image-card__tag">{program.categoryTag}</span>
          <span className="yoga-image-card__format">
            {isOnline ? <Video size={11} /> : <MapPin size={11} />}
            <span>{program.format}</span>
          </span>
        </div>

        <div className="yoga-image-card__content">
          <h3 className="yoga-image-card__title">{program.title}</h3>
          <div className="yoga-image-card__meta">
            <span className="yoga-image-card__duration">
              <Clock size={12} />
              <span>{program.duration}</span>
            </span>
          </div>
        </div>

        {isSelected && (
          <div className="yoga-image-card__selected-badge">
            Selected
          </div>
        )}
      </div>
    </article>
  );
});

YogaProgramImageCard.displayName = 'YogaProgramImageCard';
