import React from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  UserCheck,
  Users,
  Sparkles,
  Award,
  Sliders,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { YOGAATHMA_DATA } from '../../data/yogaathmaData';
import {
  staggerContainerVariants,
  fadeUpVariants,
  standardViewport,
} from '@/shared/lib/animations';
import './YogaStepsSection.css';

const WHY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Stethoscope,
  UserCheck,
  Users,
  Sparkles,
  Award,
  Sliders,
  HeartHandshake,
};

export const YogaStepsSection: React.FC = React.memo(() => {
  const { personalizedSteps, whyChoose, whoCanJoin, whoCanJoinNote } = YOGAATHMA_DATA;

  return (
    <div className="yoga-steps-block">
      {/* 5-Step Process Section */}
      <motion.section
        className="yoga-steps-section"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <div className="yoga-section-header text-center">
          <span className="yoga-section-tag">METHODOLOGY</span>
          <h2 className="yoga-section-title">Our Approach to Personalized Practice</h2>
          <p className="yoga-section-subtitle-serif">Yoga That Fits Your Needs, Abilities &amp; Goals</p>
        </div>

        <div className="yoga-steps-timeline">
          {personalizedSteps.map((step) => (
            <motion.div key={step.step} className="yoga-step-card" variants={fadeUpVariants}>
              <div className="yoga-step-card__number">{step.step}</div>
              <div className="yoga-step-card__content">
                <h3 className="yoga-step-card__title">{step.title}</h3>
                <p className="yoga-step-card__desc">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Choose Jeevayurniketan | Yogaathma */}
      <motion.section
        className="yoga-why-section"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <div className="yoga-section-header text-center">
          <span className="yoga-section-tag">THE YOGAATHMA DIFFERENCE</span>
          <h2 className="yoga-section-title">Why Choose Jeevayurniketan | Yogaathma?</h2>
          <p className="yoga-section-subtitle-serif">A Thoughtful, Individualized Approach to Yoga</p>
        </div>

        <div className="yoga-why-grid">
          {whyChoose.map((item, idx) => {
            const Icon = WHY_ICONS[item.iconName] || Sparkles;
            return (
              <motion.div key={idx} className="yoga-why-card" variants={fadeUpVariants}>
                <div className="yoga-why-card__icon">
                  <Icon size={20} />
                </div>
                <h3 className="yoga-why-card__title">{item.title}</h3>
                <p className="yoga-why-card__desc">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Who Can Join Our Yoga Sessions */}
      <motion.section
        className="yoga-who-section"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <div className="yoga-who-box">
          <div className="yoga-who-box__intro">
            <span className="yoga-section-tag">INCLUSIVITY</span>
            <h3 className="yoga-who-box__title">Who Can Join Our Yoga Sessions?</h3>
            <p className="yoga-who-box__desc">
              Whether you are completely new to yoga, recovering flexibility, or looking for mindful routine support, our programs welcome you warmly.
            </p>
          </div>

          <div className="yoga-who-box__list-wrap">
            <ul className="yoga-who-box__list">
              {whoCanJoin.map((item, i) => (
                <li key={i}>
                  <CheckCircle size={16} className="yoga-who-box__check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="yoga-who-box__note">
              <HelpCircle size={16} className="yoga-who-box__note-icon" />
              <span>{whoCanJoinNote}</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
});

YogaStepsSection.displayName = 'YogaStepsSection';
