import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, MessageCircle, Clock, Video, ArrowRight } from 'lucide-react';
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
  const whatsappUrl = `https://wa.me/918970695250?text=${encodeURIComponent(
    `Hello Jeevayurniketan | Yogaathma, I would like to enquire about the "${program.title}" program.`
  )}`;

  return (
    <motion.article
      className="yoga-showcase-card"
      variants={fadeUpVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {/* Visual Image Header */}
      <div className="yoga-showcase-card__media">
        <img
          src={program.image}
          alt={`${program.title} - Jeevayurniketan | Yogaathma`}
          className="yoga-showcase-card__img"
          loading="lazy"
          decoding="async"
        />
        <div className="yoga-showcase-card__overlay" />

        {/* Category Badge */}
        <span className="yoga-showcase-card__category-badge">
          <Sparkles size={11} />
          <span>{program.categoryTag}</span>
        </span>

        {/* Format Badge */}
        <span className="yoga-showcase-card__format-badge">
          <Video size={11} />
          <span>{program.format}</span>
        </span>
      </div>

      {/* Card Content */}
      <div className="yoga-showcase-card__body">
        <div className="yoga-showcase-card__header">
          <span className="yoga-showcase-card__number">{program.number}</span>
          <h3 className="yoga-showcase-card__title">{program.title}</h3>
        </div>

        <p className="yoga-showcase-card__tagline">
          {program.tagline}
        </p>

        <p className="yoga-showcase-card__desc">
          {program.description}
        </p>

        {/* Highlights / Ideal For List */}
        {program.idealFor && program.idealFor.length > 0 && (
          <div className="yoga-showcase-card__highlights">
            <span className="yoga-showcase-card__highlights-title">
              {program.idealForTitle || 'Program Focus & Ideal For:'}
            </span>
            <ul className="yoga-showcase-card__list">
              {program.idealFor.map((item, i) => (
                <li key={i}>
                  <Check size={14} className="yoga-showcase-card__check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Clinical Practice Focus */}
        {program.focus && (
          <div className="yoga-showcase-card__focus-box">
            <strong>Our Focus:</strong> {program.focus}
          </div>
        )}

        {/* Duration Meta */}
        <div className="yoga-showcase-card__duration-row">
          <Clock size={14} className="yoga-showcase-card__clock-icon" />
          <span>Session Duration: {program.duration}</span>
        </div>

        {/* Action Buttons */}
        <div className="yoga-showcase-card__actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="yoga-showcase-btn-whatsapp"
          >
            <MessageCircle size={16} />
            <span>Book on WhatsApp</span>
          </a>

          <a
            href="#timetable"
            className="yoga-showcase-btn-schedule"
          >
            <span>View Schedule</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
});

YogaProgramShowcaseCard.displayName = 'YogaProgramShowcaseCard';

