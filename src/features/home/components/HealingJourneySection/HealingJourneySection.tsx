import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { ROUTES } from '@/shared/config/routes';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './HealingJourneySection.css';

interface GalleryCardItem {
  id: string;
  src: string;
  alt: string;
}

const TREATMENT_IMAGES: GalleryCardItem[] = [
  {
    id: 'shot-6',
    src: '/treatments/treatment-1.png',
    alt: 'Ayurvedic Botanical Treatment & Natural Remedies',
  },
  {
    id: 'shot-5',
    src: '/treatments/treatment-2.jpg',
    alt: 'Holistic Herbal Therapy & Therapeutic Oils',
  },
  {
    id: 'shot-4',
    src: '/treatments/treatment-3.jpg',
    alt: 'Ayurvedic Nutrition & Mind-Body Restoration',
  },
];

export const HealingJourneySection: React.FC = React.memo(() => {
  return (
    <section
      className="healing-journey-section"
      id="treatments"
      aria-label="Our Treatments and Yoga"
    >
      <div className="healing-journey-container">
        {/* ==================================================================
            1. OUR TREATMENTS
            ================================================================== */}
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

        {/* Treatments Live Stream Marquee */}
        <div className="journey-stream-viewport">
          <div className="journey-stream-track">
            {[
              ...TREATMENT_IMAGES,
              ...TREATMENT_IMAGES,
              ...TREATMENT_IMAGES,
              ...TREATMENT_IMAGES,
            ].map((item, index) => (
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

        {/* Action Button: View Our Treatments */}


        {/* Doctor-Guided Therapeutic Yoga & Chikitsa Synergy Bridge */}
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

        {/* Section Divider */}
        <div className="journey-stream-divider" aria-hidden="true" />

        {/* ==================================================================
            2. OUR YOGA
            ================================================================== */}
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

        {/* ==================================================================
            3. BOTTOM CTA BOX
            ================================================================== */}
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
