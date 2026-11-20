import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, HeartPulse, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { ROUTES } from '@/shared/config/routes';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import consultationImg from '@/assets/ayurveda_consultation.jpg';
import { DR_AHALYA_DATA } from '../../data/drAhalyaData';
import { LiquidWavePortrait } from '../LiquidWavePortrait';
import './DoctorIntroSection.css';

export const DoctorIntroSection: React.FC = React.memo(() => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="practitioner" className="doctor-intro-section" aria-label={`${DR_AHALYA_DATA.name} introduction`}>
      <div className="doctor-intro-section__glow" />
      <div className="doctor-intro-section__container">
        <motion.div
          className="doctor-intro-section__media"
          ref={cardRef}
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="doctor-intro-section__shadow-carrier">
            <LiquidWavePortrait
              primarySrc="https://res.cloudinary.com/liccrmic/image/upload/v1792910336/athalya-cmprsd.jpg"
              secondarySrc={consultationImg}
              alt={`${DR_AHALYA_DATA.name} — ${DR_AHALYA_DATA.role}`}
              secondaryAlt={`${DR_AHALYA_DATA.name} — Personalized Consultations`}
              credentials={DR_AHALYA_DATA.degrees}
              imageY={imageY}
            />
          </div>
          <div className="doctor-intro-section__stamp" aria-hidden="true">
            <Leaf size={18} />
            <span>Personalized<br />Ayurvedic Care</span>
          </div>
        </motion.div>

        <motion.div
          className="doctor-intro-section__content"
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerContainerVariants}
        >
          <motion.div className="doctor-intro-section__eyebrow" variants={fadeUpVariants}>
            <Sparkles size={15} />
            <span>Meet your practitioner</span>
          </motion.div>
          <motion.h2 className="doctor-intro-section__title" variants={fadeUpVariants}>
            {DR_AHALYA_DATA.name}
          </motion.h2>
          <motion.p className="doctor-intro-section__role" variants={fadeUpVariants}>{DR_AHALYA_DATA.role}</motion.p>
          <motion.p className="doctor-intro-section__tagline" variants={fadeUpVariants} style={{ margin: '10px 0 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Care that sees the person, not just the symptoms.
          </motion.p>
          <motion.p className="doctor-intro-section__summary" variants={fadeUpVariants}>{DR_AHALYA_DATA.shortIntro}</motion.p>

          <motion.div className="doctor-intro-section__principles" variants={fadeUpVariants}>
            <div className="doctor-intro-section__principle">
              <HeartPulse size={18} />
              <span>Personalized consultations</span>
            </div>
            <div className="doctor-intro-section__principle">
              <Leaf size={18} />
              <span>Ayurveda, yoga & meditation</span>
            </div>
          </motion.div>

          <motion.div className="doctor-intro-section__actions" variants={fadeUpVariants}>
            <BookAppointmentButton size="md" variant="primary" label="Book a consultation" />
            <Link to={ROUTES.TEAM} className="doctor-intro-section__link">
              <span>Read full profile</span>
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

DoctorIntroSection.displayName = 'DoctorIntroSection';
