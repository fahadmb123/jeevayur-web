import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { ROUTES } from '@/shared/config/routes';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import treatmentMusculoskeletalImg from '@/assets/treatment_musculoskeletal.jpg';
import treatmentMentalWellbeingImg from '@/assets/treatment_mental_wellbeing.jpg';
import treatmentDigestiveImg from '@/assets/treatment_digestive.jpg';
import treatmentSkinHairImg from '@/assets/treatment_skin_hair.jpg';
import treatmentMetabolicImg from '@/assets/treatment_metabolic.jpg';
import treatmentWomensHealthImg from '@/assets/treatment_womens_health.jpg';
import consultationImg from '@/assets/ayurveda_consultation.jpg';
import smritiMeditationImg from '@/assets/smriti_meditation.jpg';
import './HealingJourneySection.css';

interface ShowcaseImageItem {
  id: string;
  src: string;
  alt: string;
}

const SHOWCASE_TREATMENT_IMAGES: ShowcaseImageItem[] = [
  {
    id: 'shot-digestive',
    src: treatmentDigestiveImg,
    alt: 'Classical Ayurvedic Gut & Digestive Metabolic Care',
  },
  {
    id: 'shot-mental',
    src: treatmentMentalWellbeingImg,
    alt: 'Satvavajaya Chikitsa & Mental Rejuvenation Therapy',
  },
  {
    id: 'shot-musculoskeletal',
    src: treatmentMusculoskeletalImg,
    alt: 'Musculoskeletal Rehabilitation & Joint Mobility Therapies',
  },
  {
    id: 'shot-consultation',
    src: consultationImg,
    alt: 'Individualized Constitutional Assessment & Herbal Guidance',
  },
  {
    id: 'shot-skin-hair',
    src: treatmentSkinHairImg,
    alt: 'Natural Botanical Dermatology & Therapeutic Formulations',
  },
  {
    id: 'shot-metabolic',
    src: treatmentMetabolicImg,
    alt: 'Herbal Metabolism Optimization & Detoxification Care',
  },
  {
    id: 'shot-womens',
    src: treatmentWomensHealthImg,
    alt: 'Holistic Women’s Health & Hormonal Balance Protocols',
  },
  {
    id: 'shot-meditation',
    src: smritiMeditationImg,
    alt: 'Smriti Meditation & Mind-Body Restoration',
  },
];

export const HealingJourneySection: React.FC = React.memo(() => {
  const marqueeItems = useMemo(() => {
    return [
      ...SHOWCASE_TREATMENT_IMAGES,
      ...SHOWCASE_TREATMENT_IMAGES,
    ];
  }, []);

  return (
    <section
      className="healing-journey-section"
      id="treatments"
      aria-label="Our Treatments and Yoga"
    >
      <div className="healing-journey-container">
        <motion.div
          className="healing-journey-header text-center"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <motion.p className="journey-subtitle" variants={fadeUpVariants}>
            Classical Ayurvedic treatments including Abhyanga, Shirodhara, and customized herbal formulations prescribed following individual clinical assessment.
          </motion.p>
        </motion.div>

        <div className="journey-stream-viewport">
          <div className="journey-stream-track">
            {marqueeItems.map((item, index) => (
              <article
                key={`treatment-${item.id}-${index}`}
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
          className="services-yoga-bridge"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="services-yoga-bridge__inner">
            <div className="services-yoga-bridge__text">
              <h3 className="services-yoga-bridge__title">
                Doctor-Guided Therapeutic Yoga &amp; Chikitsa
              </h3>
              <p className="services-yoga-bridge__desc">
                To complement our clinical treatments, <strong>Jeevayurniketan | Yogaathma</strong> provides personalized therapeutic movement, joint mobility protocols, and pranayama breathing tailored for musculoskeletal care, metabolic balance, and nervous rejuvenation.
              </p>
            </div>

            <div className="services-yoga-bridge__actions">
              <Link to={ROUTES.SERVICES} className="journey-view-treatments-btn">
                <span>View Our Treatments</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="journey-stream-divider" aria-hidden="true" />

        <motion.div
          className="healing-journey-header text-center"
          id="yoga"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <motion.div className="section-pill" variants={fadeUpVariants}>
            <Sparkles size={14} />
            <span>Mindful Disciplines</span>
          </motion.div>
          <motion.h2 className="journey-title" variants={fadeUpVariants}>
            Our <span className="text-primary-green">Yoga</span>
          </motion.h2>
          <motion.p className="journey-subtitle" variants={fadeUpVariants}>
            Restorative Asanas, Pranayama breath regulation, and meditation practices tailored to your constitution to support physical vitality and mental equilibrium.
          </motion.p>
        </motion.div>

        <motion.div
          className="journey-cta-box"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="journey-cta-content">
            <h3>Begin Your Personalized Healthcare Journey</h3>
            <p>Schedule an individual consultation with Dr. Ahalya T.S. for classical Ayurvedic healthcare and lifestyle guidance.</p>
          </div>
          <BookAppointmentButton
            label="Schedule Consultation Now"
            size="lg"
            variant="primary"
          />
        </motion.div>
      </div>
    </section>
  );
});

HealingJourneySection.displayName = 'HealingJourneySection';
