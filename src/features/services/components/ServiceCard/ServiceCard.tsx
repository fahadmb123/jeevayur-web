import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import type { AyurvedaService } from '../../types';
import { fadeUpVariants } from '@/shared/lib/animations';
import { ServiceDetailModal } from '../ServiceDetailModal';
import './ServiceCard.css';

export interface ServiceCardProps {
  service: AyurvedaService;
  index?: number;
  isCenteredSingle?: boolean;
}

const SERVICE_THEMES: Record<
  string,
  {
    tag: string;
    accentColor: string;
  }
> = {
  'metabolic-health': {
    tag: 'PRAMEHA & AGNI',
    accentColor: '#1B6B50',
  },
  'womens-health': {
    tag: 'STREE ROGA',
    accentColor: '#E06D85',
  },
  'musculoskeletal-care': {
    tag: 'SANDHI CHIKITSA',
    accentColor: '#2563EB',
  },
  'mental-wellbeing': {
    tag: 'SATVAVAJAYA',
    accentColor: '#8B5CF6',
  },
  'digestive-health': {
    tag: 'JATHARAGNI',
    accentColor: '#EA580C',
  },
  'skin-hair-health': {
    tag: 'TWAK & KESA',
    accentColor: '#C98D3B',
  },
  'neurological-health': {
    tag: 'VATA & MAJJA',
    accentColor: '#0EA5E9',
  },
  'respiratory-health': {
    tag: 'PRANAWAHA SROTAS',
    accentColor: '#06B6D4',
  },
  'geriatric-health': {
    tag: 'RASAYANA CHIKITSA',
    accentColor: '#D97706',
  },
  'preventive-healthcare': {
    tag: 'SWASTHAVRITTA',
    accentColor: '#059669',
  },
};

export const ServiceCard: React.FC<ServiceCardProps> = React.memo(({
  service,
  isCenteredSingle = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const theme = SERVICE_THEMES[service.id] || {
    tag: (service.categoryTag || 'Clinical Care').toUpperCase(),
    accentColor: '#1B6B50',
  };

  return (
    <>
      <div
        className={`treatment-card-slot ${isCenteredSingle ? 'is-centered-single' : ''}`}
      >
        <motion.article
          className={`treatment-clean-card ${isToggled ? 'is-expanded' : ''}`}
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          onClick={() => {
            // On touch screens toggle open/close; on desktop open details modal
            if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
              setIsToggled((prev) => !prev);
            } else {
              setIsModalOpen(true);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
          aria-label={`View clinical details for ${service.title}`}
        >
          {/* Prominent Serif Treatment Title (Centered in middle of card) */}
          <h3 className="treatment-clean-card__title">
            {service.title}
          </h3>

          {/* Collapsible Content: Expands on hover with details */}
          <div className="treatment-clean-card__collapsible">
            <div className="treatment-clean-card__collapsible-inner">
              {/* Clinical Description Paragraph */}
              <p className="treatment-clean-card__desc">
                {service.description}
              </p>

              {/* Benefits Checklist */}
              {service.benefits && service.benefits.length > 0 && (
                <ul className="treatment-clean-card__benefits">
                  {service.benefits.slice(0, 2).map((benefit, i) => (
                    <li key={i}>
                      <Check size={14} className="treatment-clean-card__check" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Bottom Footer: Explore Protocol Link + Duration */}
              <div className="treatment-clean-card__footer">
                <button
                  type="button"
                  className="treatment-clean-card__cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <span>Explore Protocol</span>
                  <ArrowUpRight size={14} />
                </button>

                {service.duration && (
                  <span className="treatment-clean-card__duration">
                    <Clock size={13} className="treatment-clean-card__clock" />
                    <span>{service.duration}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Detail Modal */}
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
        iconComponent={Sparkles}
        themeTag={theme.tag}
        accentColor={theme.accentColor}
      />
    </>
  );
});

ServiceCard.displayName = 'ServiceCard';
