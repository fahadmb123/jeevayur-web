import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Award,
} from 'lucide-react';
import { YOGAATHMA_DATA } from '../../data/yogaathmaData';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { YogaProgramCard } from '../YogaProgramCard';
import { ROUTES } from '@/shared/config/routes';
import {
  staggerContainerVariants,
  fadeUpVariants,
  standardViewport,
} from '@/shared/lib/animations';
import therapeuticImg from '@/assets/yoga_therapeutic.jpg';
import pranayamaImg from '@/assets/yoga_pranayama.jpg';
import personalizedImg from '@/assets/yoga_personalized.jpg';
import meditationImg from '@/assets/smriti_meditation.jpg';
import groupImg from '@/assets/yoga_group.jpg';
import './YogaathmaSection.css';

interface ShowcaseYogaItem {
  id: string;
  src: string;
  alt: string;
}

const SHOWCASE_YOGA_IMAGES: ShowcaseYogaItem[] = [
  {
    id: 'yoga-therapeutic',
    src: therapeuticImg,
    alt: 'Doctor-Guided Therapeutic Yoga & Spinal Mobility Care',
  },
  {
    id: 'yoga-pranayama',
    src: pranayamaImg,
    alt: 'Classical Pranayama Breath Regulation & Vital Energy Balance',
  },
  {
    id: 'yoga-personalized',
    src: personalizedImg,
    alt: 'Personalized 1-on-1 Constitutional Movement Flow',
  },
  {
    id: 'yoga-meditation',
    src: meditationImg,
    alt: 'Restorative Dhyana Meditation & Nervous System Calmitude',
  },
  {
    id: 'yoga-group',
    src: groupImg,
    alt: 'Community Yoga Shala & Guided Asana Practice',
  },
];

const PILLAR_ICONS = [Compass, Award, Heart, Sparkles, ShieldCheck];

export const YogaathmaSection: React.FC = React.memo(() => {
  const { hero, approach, programs } = YOGAATHMA_DATA;

  const marqueeItems = useMemo(() => {
    return [
      ...SHOWCASE_YOGA_IMAGES,
      ...SHOWCASE_YOGA_IMAGES,
      ...SHOWCASE_YOGA_IMAGES,
    ];
  }, []);

  const whatsappHeroUrl = CLINIC_CONTACT.getWhatsappUrl(hero.whatsappMessage);

  return (
    <section id="yoga" className="yogaathma-section">
      <div className="yogaathma-container">
        <motion.div
          className="yogaathma-header text-center"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <motion.div className="yogaathma-badge-wrap" variants={fadeUpVariants}>
            <span className="yogaathma-badge">
              <Sparkles size={13} className="yogaathma-badge-icon" />
              <span>{hero.badge}</span>
            </span>
          </motion.div>

          <motion.h2 className="yogaathma-title" variants={fadeUpVariants}>
            {hero.title}
          </motion.h2>

          <motion.p className="yogaathma-tagline" variants={fadeUpVariants}>
            {hero.subtitle}
          </motion.p>

          <motion.p className="yogaathma-desc" variants={fadeUpVariants}>
            {hero.description}
          </motion.p>

          <motion.div className="yogaathma-hero-actions" variants={fadeUpVariants}>
            <a
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="yogaathma-btn-primary"
            >
              <MessageCircle size={16} />
              <span>{hero.ctaPrimary}</span>
            </a>

            <Link to={ROUTES.YOGA} className="yogaathma-btn-secondary">
              <Calendar size={16} />
              <span>{hero.ctaSecondary}</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="yogaathma-pillars-row"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="yogaathma-pillars-intro text-center">
            <span className="yogaathma-subheading-tag">{approach.badge}</span>
            <h3 className="yogaathma-approach-title">{approach.title}</h3>
            <p className="yogaathma-approach-lead">{approach.lead}</p>
          </div>

          <div className="yogaathma-pillars-grid">
            {approach.pillars.map((pillar, idx) => {
              const IconComp = PILLAR_ICONS[idx % PILLAR_ICONS.length];
              return (
                <motion.div
                  key={idx}
                  className="yogaathma-pillar-card"
                  variants={fadeUpVariants}
                >
                  <div className="yogaathma-pillar-card__icon">
                    <IconComp size={20} />
                  </div>
                  <h4 className="yogaathma-pillar-card__title">{pillar.title}</h4>
                  <p className="yogaathma-pillar-card__desc">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="yogaathma-programs-block"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="yogaathma-programs-header text-center">
            <span className="yogaathma-subheading-tag">CURATED PATHWAYS</span>
            <h3 className="yogaathma-programs-title">Our Yoga Programs</h3>
            <p className="yogaathma-programs-desc">
              Hover over each pathway below to explore specialized techniques, focus areas, and session formats.
            </p>
          </div>

          <div className="yogaathma-programs-grid">
            {programs.map((program, index) => (
              <YogaProgramCard
                key={program.id}
                program={program}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="yogaathma-stream-wrapper">
        <div className="journey-stream-viewport">
          <div className="journey-stream-track journey-stream-track--reverse">
            {marqueeItems.map((item, index) => (
              <article
                key={`yoga-${item.id}-${index}`}
                className="journey-card journey-card--image-only"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="journey-card__img"
                  loading="lazy"
                  decoding="async"
                />
              </article>
            ))}
          </div>
        </div>

        <motion.div
          className="journey-actions-bar"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <Link to={ROUTES.YOGA} className="journey-view-treatments-btn">
            <span>View Our Yoga</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

YogaathmaSection.displayName = 'YogaathmaSection';
