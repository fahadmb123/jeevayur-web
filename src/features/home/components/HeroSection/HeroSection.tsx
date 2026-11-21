import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import type { Variants } from 'framer-motion';
import heroFlatlayExact from '@/assets/hero_flatlay_exact.png';
import { Calendar } from 'lucide-react';
import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { useInitialLoading } from '@/shared/ui/LoadingScreen';
import './HeroSection.css';

const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.18,
    },
  },
};

const slideFromTopVariants: Variants = {
  hidden: { opacity: 0, y: -36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const imageSlideFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 220 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
    },
  },
};

export const HeroSection: React.FC = React.memo(() => {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const { isInitialLoading } = useInitialLoading();
  const animationState = isInitialLoading ? 'hidden' : 'visible';

  return (
    <LazyMotion features={domAnimation}>
      <section id="home" className="hero-exact-section" aria-label="Jeevayurniketan Ayurvedic Healthcare">
        <div className="hero-exact-layout">
          
          {/* Left Column: Ivory Background with Editorial Text */}
          <div className="hero-exact-left">
            <m.div
              className="hero-exact-content"
              initial="hidden"
              animate={animationState}
              variants={textContainerVariants}
            >
              {/* Welcome Pill */}
              <m.div className="hero-exact-pill" variants={slideFromTopVariants}>
                <span>JEEVAYURNIKETAN AYURVEDA</span>
              </m.div>

              {/* Headline */}
              <m.h1 className="hero-exact-title" variants={slideFromTopVariants}>
                Natural wellness for<br />
                everyday balance
              </m.h1>

              {/* Subtitle */}
              <m.p className="hero-exact-desc" variants={slideFromTopVariants}>
                Consult with Dr. Ahalya T.S. for individualized Ayurvedic healthcare, restorative yoga therapy, and root-cause healing tailored to your unique constitution.
              </m.p>

              {/* Buttons Row */}
              <m.div className="hero-exact-actions" variants={slideFromTopVariants}>
                <button
                  type="button"
                  className="hero-exact-btn-shop"
                  onClick={() => setIsBookingOpen(true)}
                >
                  <Calendar size={16} className="btn-icon" />
                  <span>BOOK CONSULTATION</span>
                </button>

                <a href="#practitioner" className="hero-exact-btn-explore">
                  <span>EXPLORE PRACTICE</span>
                  <span className="btn-arrow">&rarr;</span>
                </a>
              </m.div>
            </m.div>
          </div>

          {/* Right Column: Flat-Lay Card sliding in from the right */}
          <div className="hero-exact-right">
            <m.div
              className="hero-exact-card"
              initial="hidden"
              animate={animationState}
              variants={imageSlideFromRightVariants}
            >
              <img
                src={heroFlatlayExact}
                alt="Classical Ayurvedic herbal formulations, medicinal oils, and restorative botanicals"
                className="hero-exact-card-img"
                loading="eager"
                decoding="async"
              />
            </m.div>
          </div>

        </div>

        {/* Modal Dialog */}
        <BookAppointmentModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />

        {/* Exact Organic Wave Divider Transition into Category Circles */}
        <div className="hero-exact-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 85" fill="none" preserveAspectRatio="none" className="hero-wave-svg">
            <path
              d="M0,32 C260,65 520,70 780,38 C1040,6 1260,16 1440,32 L1440,85 L0,85 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>
    </LazyMotion>
  );
});

HeroSection.displayName = 'HeroSection';
