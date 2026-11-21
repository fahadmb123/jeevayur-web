import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceCard } from '../ServiceCard';
import { useTreatments } from '../../hooks/useTreatments';
import {
  staggerContainerVariants,
  fadeUpVariants,
  standardViewport,
} from '@/shared/lib/animations';
import './ServicesSection.css';

export const ServicesSection: React.FC = React.memo(() => {
  const { services } = useTreatments();
  const [showAll, setShowAll] = useState(false);

  // Show 6 treatments (2 rows of 3) by default, or all when expanded
  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <section id="services" className="services-section">
      {/* Header */}
      <motion.div
        className="services-header text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <motion.div className="services-header__badge-wrap" variants={fadeUpVariants}>
          <span className="services-header__pill">
            <Sparkles size={13} className="services-header__sparkle" />
            <span>HEALTHCARE CATEGORIES</span>
          </span>
        </motion.div>

        <motion.h2 className="section-title" variants={fadeUpVariants}>
          Ayurvedic Clinical Services
        </motion.h2>

        <motion.p className="services-subtitle" variants={fadeUpVariants}>
          Individualized healthcare consultations, classical herbal formulations, and personalized lifestyle guidance across our specialized treatment domains.
        </motion.p>
      </motion.div>

      {/* 3-Cards-Per-Line Grid */}
      <motion.div
        className="treatments-grid-3col"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        {visibleServices.map((service, index) => {
          // If the last card is alone in its row (e.g. 10th card in a 3-col grid), center it in column 2
          const isCenteredSingle =
            visibleServices.length % 3 === 1 && index === visibleServices.length - 1;

          return (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isCenteredSingle={isCenteredSingle}
            />
          );
        })}
      </motion.div>

      {/* Toggle View More/Less Button if more than 6 treatments */}
      {services.length > 6 && (
        <div className="services-toggle-wrap">
          <button
            type="button"
            className="services-toggle-btn"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
          >
            <span>{showAll ? 'Show Fewer Treatments' : `Explore All ${services.length} Treatments`}</span>
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
