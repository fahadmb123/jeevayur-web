import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Video, MapPin, ArrowRight } from 'lucide-react';
import type { YogaProgram } from '../data/yogaathmaData';
import { fadeUpVariants } from '@/shared/lib/animations';
import './YogaProgramShowcaseCard.css';

export interface YogaProgramShowcaseCardProps {
  program: YogaProgram;
  index: number;
}

export const YogaProgramShowcaseCard: React.FC<YogaProgramShowcaseCardProps> = React.memo(({
  program,
  index,
}) => {
  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    `Hello Jeevayurniketan | Yogaathma, I would like to book or enquire about the "${program.title}" program.`
  )}`;

  return (
    <motion.article
      className="yoga-editorial-card"
      variants={fadeUpVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {/* Visual Photography */}
      <div className="yoga-card-media">
        <img
          src={program.image}
          alt={`${program.title} - Authentic Yogic Practice at Jeevayurniketan`}
          className="yoga-card-img"
          loading="lazy"
          decoding="async"
        />
        <div className="yoga-card-overlay" />

        {/* Top Badges */}
        <div className="yoga-card-meta-top">
          <span className="yoga-program-num">{program.number}</span>
          <span className="yoga-program-category">{program.categoryTag}</span>
        </div>

        {/* Format Pill */}
        <div className="yoga-card-format-pill">
          {program.format.toLowerCase().includes('online') ? (
            <Video size={12} />
          ) : (
            <MapPin size={12} />
          )}
          <span>{program.format}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="yoga-card-body">
        <h3 className="yoga-card-title">{program.title}</h3>
        <p className="yoga-card-tagline">{program.tagline}</p>
        <p className="yoga-card-desc">{program.description}</p>

        {/* Focused Benefits / Ideal For as Botanical Chips */}
        {program.idealFor && program.idealFor.length > 0 && (
          <div className="yoga-card-focus-chips">
            {program.idealFor.slice(0, 3).map((item, i) => (
              <span key={i} className="yoga-focus-chip">
                <em>✦</em> {item}
              </span>
            ))}
          </div>
        )}

        {/* Duration Meta */}
        <div className="yoga-card-meta-row">
          <Clock size={13} className="text-accent-gold" />
          <span>{program.duration}</span>
        </div>

        {/* Actions */}
        <div className="yoga-card-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="yoga-btn-reserve"
          >
            <MessageCircle size={15} />
            <span>Reserve Mat on WhatsApp</span>
          </a>

          <a href="#yoga-schedule" className="yoga-btn-timetable">
            <span>Timetable</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </motion.article>
  );
});

YogaProgramShowcaseCard.displayName = 'YogaProgramShowcaseCard';
