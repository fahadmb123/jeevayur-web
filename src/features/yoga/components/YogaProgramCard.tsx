import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Clock, Video } from 'lucide-react';
import type { YogaProgram } from '../data/yogaathmaData';
import { fadeUpVariants } from '@/shared/lib/animations';
import './YogaProgramCard.css';

export interface YogaProgramCardProps {
  program: YogaProgram;
  index: number;
  isCenteredSingle?: boolean;
}

export const YogaProgramCard: React.FC<YogaProgramCardProps> = React.memo(({
  program,
  isCenteredSingle = false,
}) => {
  const [isToggled, setIsToggled] = useState(false);

  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    `Hello Jeevayurniketan | Yogaathma, I would like to enquire about the "${program.title}" program.`
  )}`;

  return (
    <div className={`yoga-program-card-slot ${isCenteredSingle ? 'is-centered-single' : ''}`}>
      <motion.article
        className={`yoga-program-clean-card ${isToggled ? 'is-expanded' : ''}`}
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        onClick={() => {
          // On touch screens toggle open/close
          if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
            setIsToggled((prev) => !prev);
          }
        }}
        role="region"
        aria-label={`Program: ${program.title}`}
      >
        {/* Closed State: Prominent Centered Serif Title */}
        <h3 className="yoga-program-clean-card__title">
          {program.title}
        </h3>

        {/* Collapsible Content: Smoothly reveals details on hover */}
        <div className="yoga-program-clean-card__collapsible">
          <div className="yoga-program-clean-card__collapsible-inner">
            {/* Tagline */}
            <p className="yoga-program-clean-card__tagline">
              {program.tagline}
            </p>

            {/* Description */}
            <p className="yoga-program-clean-card__desc">
              {program.description}
            </p>

            {/* Ideal For / Highlights Checklist */}
            {program.idealFor && program.idealFor.length > 0 && (
              <div className="yoga-program-clean-card__highlights">
                <span className="yoga-program-clean-card__highlights-title">
                  {program.idealForTitle}
                </span>
                <ul className="yoga-program-clean-card__list">
                  {program.idealFor.slice(0, 3).map((item, i) => (
                    <li key={i}>
                      <Check size={14} className="yoga-program-clean-card__check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Focus Statement */}
            <p className="yoga-program-clean-card__focus">
              <strong>Our focus:</strong> {program.focus}
            </p>

            {/* Bottom Footer Row: Format, Duration, and WhatsApp Booking */}
            <div className="yoga-program-clean-card__footer">
              <div className="yoga-program-clean-card__meta">
                <span className="yoga-program-meta-item">
                  <Video size={13} />
                  <span>{program.format}</span>
                </span>
                <span className="yoga-program-meta-item">
                  <Clock size={13} />
                  <span>{program.duration}</span>
                </span>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="yoga-program-clean-card__cta"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={15} />
                <span>Enquire &amp; Book</span>
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
});

YogaProgramCard.displayName = 'YogaProgramCard';
