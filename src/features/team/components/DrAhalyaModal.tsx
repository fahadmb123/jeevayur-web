import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, GraduationCap, Heart, Compass, CheckCircle2, Calendar } from 'lucide-react';
import { DR_AHALYA_DATA } from '../data/drAhalyaData';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import './DrAhalyaModal.css';

interface DrAhalyaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'bio' | 'approach' | 'training';
}

export const DrAhalyaModal: React.FC<DrAhalyaModalProps> = React.memo(({ isOpen, onClose, defaultTab = 'bio' }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'approach' | 'training'>(defaultTab);
  const [activeStepFilter, setActiveStepFilter] = useState<'all' | 'Diagnostic Foundation' | 'Therapeutic Prescription' | 'Integrative Wellness'>('all');

  const filteredSteps = activeStepFilter === 'all'
    ? DR_AHALYA_DATA.treatmentSteps
    : DR_AHALYA_DATA.treatmentSteps.filter((s) => s.category === activeStepFilter);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="ahalya-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          className="ahalya-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="ahalya-modal-close"
            onClick={onClose}
            aria-label="Close Doctor Profile"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="ahalya-modal-header">
            <div className="ahalya-header-portrait-wrap">
              <img
                src={DR_AHALYA_DATA.image}
                alt={DR_AHALYA_DATA.name}
                className="ahalya-header-portrait"
              />
              <span className="ahalya-header-active-badge" title="Available for Consultations"></span>
            </div>

            <div className="ahalya-header-info">
              <div className="ahalya-header-pill">
                <Sparkles size={13} />
                <span>Ayurveda • Yoga • Meditation • Holistic Wellness</span>
              </div>
              <h2 className="ahalya-header-name">{DR_AHALYA_DATA.name}</h2>
              <p className="ahalya-header-role">{DR_AHALYA_DATA.role}</p>
              <p className="ahalya-header-degrees">{DR_AHALYA_DATA.degrees}</p>
              <p className="ahalya-header-tagline">“{DR_AHALYA_DATA.tagline}”</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="ahalya-modal-tabs">
            <button
              type="button"
              className={`ahalya-tab-btn ${activeTab === 'bio' ? 'active' : ''}`}
              onClick={() => setActiveTab('bio')}
            >
              <Heart size={15} />
              <span>Biography & Philosophy</span>
            </button>
            <button
              type="button"
              className={`ahalya-tab-btn ${activeTab === 'approach' ? 'active' : ''}`}
              onClick={() => setActiveTab('approach')}
            >
              <Compass size={15} />
              <span>10-Step Treatment Approach</span>
            </button>
            <button
              type="button"
              className={`ahalya-tab-btn ${activeTab === 'training' ? 'active' : ''}`}
              onClick={() => setActiveTab('training')}
            >
              <GraduationCap size={15} />
              <span>Education & Credentials</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="ahalya-modal-body">
            {activeTab === 'bio' && (
              <motion.div
                key="bio-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="ahalya-tab-pane"
              >
                {/* Short Intro Callout */}
                <div className="ahalya-callout-card">
                  <h4 className="ahalya-callout-title">{DR_AHALYA_DATA.shortIntroTitle}</h4>
                  <p>{DR_AHALYA_DATA.shortIntro}</p>
                </div>

                {/* About Paragraphs */}
                <div className="ahalya-text-block">
                  <h3 className="ahalya-section-heading">Clinical Background</h3>
                  {DR_AHALYA_DATA.aboutBio.map((paragraph, idx) => (
                    <p key={idx} className="ahalya-para">{paragraph}</p>
                  ))}
                </div>

                {/* Philosophy of Care & Vision Grid */}
                <div className="ahalya-duo-grid">
                  <div className="ahalya-feature-card">
                    <div className="ahalya-feature-icon-wrap">
                      <Heart size={20} />
                    </div>
                    <h4>My Philosophy of Care</h4>
                    <p>{DR_AHALYA_DATA.philosophyOfCare}</p>
                  </div>

                  <div className="ahalya-feature-card">
                    <div className="ahalya-feature-icon-wrap">
                      <Sparkles size={20} />
                    </div>
                    <h4>My Vision</h4>
                    <p>{DR_AHALYA_DATA.vision}</p>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="ahalya-text-block">
                  <h3 className="ahalya-section-heading">Areas of Clinical Interest</h3>
                  <div className="ahalya-areas-grid">
                    {DR_AHALYA_DATA.areasOfInterest.map((area) => (
                      <div key={area.title} className="ahalya-area-pill">
                        <CheckCircle2 size={16} className="text-primary-green" />
                        <div>
                          <strong>{area.title}</strong>
                          <span>{area.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'approach' && (
              <motion.div
                key="approach-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="ahalya-tab-pane"
              >
                <div className="ahalya-approach-intro">
                  <h3>Structured 10-Step Clinical Healing Pathway</h3>
                  <p>
                    Every treatment begins with a meticulous assessment of your innate constitution (Prakriti),
                    vitiation (Vikriti), and metabolic capacity (Agni), progressing into a sustainable lifestyle prescription.
                  </p>
                </div>

                {/* Category Filters */}
                <div className="ahalya-step-filters">
                  <button
                    type="button"
                    className={`step-filter-chip ${activeStepFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveStepFilter('all')}
                  >
                    All 10 Steps
                  </button>
                  <button
                    type="button"
                    className={`step-filter-chip ${activeStepFilter === 'Diagnostic Foundation' ? 'active' : ''}`}
                    onClick={() => setActiveStepFilter('Diagnostic Foundation')}
                  >
                    1. Diagnosis (Steps 1–4)
                  </button>
                  <button
                    type="button"
                    className={`step-filter-chip ${activeStepFilter === 'Therapeutic Prescription' ? 'active' : ''}`}
                    onClick={() => setActiveStepFilter('Therapeutic Prescription')}
                  >
                    2. Therapy (Steps 5–8)
                  </button>
                  <button
                    type="button"
                    className={`step-filter-chip ${activeStepFilter === 'Integrative Wellness' ? 'active' : ''}`}
                    onClick={() => setActiveStepFilter('Integrative Wellness')}
                  >
                    3. Mind-Body (Steps 9–10)
                  </button>
                </div>

                {/* Steps List */}
                <div className="ahalya-steps-list">
                  {filteredSteps.map((step) => (
                    <div key={step.step} className="ahalya-step-card">
                      <div className="ahalya-step-number">
                        <span>{String(step.step).padStart(2, '0')}</span>
                      </div>
                      <div className="ahalya-step-content">
                        <div className="ahalya-step-header">
                          <span className="ahalya-step-cat">{step.category}</span>
                          <span className="ahalya-step-focus">{step.focus}</span>
                        </div>
                        <h4 className="ahalya-step-title">{step.title}</h4>
                        <p className="ahalya-step-desc">{step.description}</p>
                        <div className="ahalya-step-principles">
                          {step.principles.map((pr, pIdx) => (
                            <span key={pIdx} className="ahalya-principle-tag">
                              • {pr}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'training' && (
              <motion.div
                key="training-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="ahalya-tab-pane"
              >
                <div className="ahalya-approach-intro">
                  <h3>Education & Advanced Clinical Accreditations</h3>
                  <p>
                    Rooted in classical BAMS graduation with specialized qualifications in counselling,
                    psychotherapy from Kottakkal, and yogic science from S-VYASA University.
                  </p>
                </div>

                <div className="ahalya-credentials-grid">
                  {DR_AHALYA_DATA.educationAndTraining.map((item, index) => (
                    <div key={index} className="ahalya-credential-card">
                      <div className="credential-badge">{item.badge}</div>
                      <h4 className="credential-degree">{item.degree}</h4>
                      <p className="credential-institution">{item.institution}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer with Direct Consultation Booking */}
          <div className="ahalya-modal-footer">
            <div className="ahalya-footer-prompt">
              <Calendar size={18} className="text-primary-green" />
              <span>Schedule a comprehensive 1-on-1 consultation with Dr. Ahalya T.S.</span>
            </div>
            <BookAppointmentButton size="md" variant="primary" label="Book Consultation" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

DrAhalyaModal.displayName = 'DrAhalyaModal';
