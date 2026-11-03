import React from 'react';
import { Clock, MessageCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { AyurvedaService } from '../types';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';

export interface TreatmentDetailsCardProps {
  service: AyurvedaService;
  services: AyurvedaService[];
  onSelectService: (service: AyurvedaService) => void;
}

export const TreatmentDetailsCard: React.FC<TreatmentDetailsCardProps> = React.memo(({
  service,
  services,
  onSelectService,
}) => {
  const currentIndex = services.findIndex((s) => s.id === service.id);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService = currentIndex >= 0 && currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    `Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatment for: ${service.title}.`
  )}`;

  return (
    <article className="treatment-details-card" id="treatment-details">
      <div className="treatment-details-card__top">
        <div className="treatment-details-card__badges">
          {service.categoryTag && (
            <span className="treatment-details-card__category">{service.categoryTag}</span>
          )}
          {service.duration && (
            <span className="treatment-details-card__duration">
              <Clock size={13} />
              <span>{service.duration}</span>
            </span>
          )}
        </div>

        <div className="treatment-details-card__nav-arrows">
          <button
            type="button"
            className="treatment-details-nav-btn"
            disabled={!prevService}
            onClick={() => prevService && onSelectService(prevService)}
            aria-label="Previous treatment"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="treatment-details-nav-btn"
            disabled={!nextService}
            onClick={() => nextService && onSelectService(nextService)}
            aria-label="Next treatment"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="treatment-details-card__main">
        <div className="treatment-details-card__body">
          <h2 className="treatment-details-card__title">{service.title}</h2>
          <p className="treatment-details-card__desc">{service.description}</p>

          {service.benefits && service.benefits.length > 0 && (
            <div className="treatment-details-card__benefits">
              <h3 className="treatment-details-card__benefits-title">Key Indications & Benefits</h3>
              <ul className="treatment-details-card__benefits-list">
                {service.benefits.map((b, i) => (
                  <li key={i} className="treatment-details-benefit-item">
                    <Check size={15} className="treatment-benefit-check" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="treatment-details-card__actions">
            <BookAppointmentButton
              label="Book Consultation"
              size="md"
              variant="primary"
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="treatment-details-card__whatsapp-btn"
            >
              <MessageCircle size={16} />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {services.length > 1 && (
        <div className="treatment-details-card__tabs">
          <span className="treatment-tabs-label">Switch Treatment:</span>
          <div className="treatment-tabs-scroll">
            {services.map((item) => {
              const isActive = item.id === service.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`treatment-quick-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectService(item)}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
});

TreatmentDetailsCard.displayName = 'TreatmentDetailsCard';
