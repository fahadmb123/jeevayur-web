import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wind,
  Heart,
  Activity,
  Sun,
  CheckCircle2,
  Shield,
  Smile,
  Users,
  AlertCircle,
} from 'lucide-react';
import { YOGAATHMA_DATA } from '../../data/yogaathmaData';
import {
  staggerContainerVariants,
  fadeUpVariants,
  standardViewport,
} from '@/shared/lib/animations';
import './YogaLearningSection.css';

const LEARN_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles,
  Wind,
  Heart,
  Activity,
  Sun,
  CheckCircle2,
};

const NEED_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shield,
  Smile,
  Users,
};

export const YogaLearningSection: React.FC = React.memo(() => {
  const { whatYoullLearn, individualNeeds } = YOGAATHMA_DATA;

  return (
    <div className="yoga-learning-block">
      {/* What You'll Learn Section */}
      <motion.section
        className="yoga-learn-section"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <div className="yoga-section-header text-center">
          <span className="yoga-section-tag">CURRICULUM &amp; HABITS</span>
          <h2 className="yoga-section-title">What You&apos;ll Learn</h2>
          <p className="yoga-section-lead">
            Build foundational body confidence, mindful respiratory rhythm, and sustainable daily habits at your own pace.
          </p>
        </div>

        <div className="yoga-learn-grid">
          {whatYoullLearn.map((topic, i) => {
            const Icon = LEARN_ICONS[topic.iconName] || Sparkles;
            return (
              <motion.div key={i} className="yoga-learn-card" variants={fadeUpVariants}>
                <div className="yoga-learn-card__icon">
                  <Icon size={22} />
                </div>
                <h3 className="yoga-learn-card__title">{topic.title}</h3>
                {topic.subtitle && (
                  <span className="yoga-learn-card__subtitle">{topic.subtitle}</span>
                )}
                <p className="yoga-learn-card__desc">{topic.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Personalized Yoga for Individual Needs */}
      <motion.section
        className="yoga-needs-section"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <div className="yoga-section-header text-center">
          <span className="yoga-section-tag">TARGETED SUPPORT</span>
          <h2 className="yoga-section-title">{individualNeeds.title}</h2>
          <p className="yoga-section-subtitle-serif">{individualNeeds.subtitle}</p>
          <p className="yoga-section-lead">{individualNeeds.description}</p>
        </div>

        <div className="yoga-needs-grid">
          {individualNeeds.categories.map((cat, i) => {
            const Icon = NEED_ICONS[cat.iconName] || Shield;
            return (
              <motion.div key={i} className="yoga-need-card" variants={fadeUpVariants}>
                <div className="yoga-need-card__header">
                  <div className="yoga-need-card__icon">
                    <Icon size={20} />
                  </div>
                  <h3 className="yoga-need-card__title">{cat.category}</h3>
                </div>
                <ul className="yoga-need-card__list">
                  {cat.items.map((item, j) => (
                    <li key={j}>
                      <span className="yoga-need-card__bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Clinical Note & Caution Alert */}
        <div className="yoga-needs-notes">
          <p className="yoga-needs-note-text">
            {individualNeeds.notes}
          </p>
          <div className="yoga-needs-warning">
            <AlertCircle size={18} className="yoga-needs-warning__icon" />
            <span>{individualNeeds.warning}</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
});

YogaLearningSection.displayName = 'YogaLearningSection';
