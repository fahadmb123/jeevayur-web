import React from 'react';
import { Info, MessageCircle } from 'lucide-react';
import type { AyurvedaService } from '../types';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';

export interface TreatmentDetailsCardProps {
  service: AyurvedaService;
  index: number;
  onSelectDetails?: () => void;
}

export const TreatmentDetailsCard: React.FC<TreatmentDetailsCardProps> = React.memo(({
  service,
  index,
  onSelectDetails,
}) => {
  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    `Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatment for: ${service.title}.`
  )}`;

  return (
    <article className="treatment-details-card">
      <div className="treatment-details-card__header">
        <div className="treatment-details-card__meta">
          <span className="treatment-details-card__number">
            {String(index + 1).padStart(2, '0')}
          </span>
          {service.categoryTag && (
            <span className="treatment-details-card__tag">
              {service.categoryTag}
            </span>
          )}
        </div>
        <h2 className="treatment-details-card__title">{service.title}</h2>
      </div>

      <p className="treatment-details-card__desc">{service.description}</p>

      {service.benefits && service.benefits.length > 0 && (
        <div className="treatment-details-card__chips-section">
          <span className="treatment-details-card__chips-label">
            Therapeutic Focus:
          </span>
          <div className="treatment-details-card__chips">
            {service.benefits.map((benefit, i) => (
              <span key={i} className="treatment-details-card__chip">
                <em>✦</em> {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="treatment-details-card__footer">
        <BookAppointmentButton
          label="Book Consultation"
          size="md"
          variant="primary"
          className="treatment-details-card__btn-book"
        />

        <div className="treatment-details-card__actions-secondary">
          {onSelectDetails && (
            <button
              type="button"
              className="treatment-details-card__btn-info"
              onClick={onSelectDetails}
            >
              <span>Clinical Protocol</span>
              <Info size={14} />
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="treatment-details-card__btn-whatsapp"
            title="Enquire on WhatsApp"
            aria-label={`Enquire about ${service.title} on WhatsApp`}
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
});

TreatmentDetailsCard.displayName = 'TreatmentDetailsCard';
