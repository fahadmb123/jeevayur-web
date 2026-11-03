import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Award, Calendar } from 'lucide-react';
import type { TeamMember } from '../types';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import './DoctorBioModal.css';

interface DoctorBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

export const DoctorBioModal: React.FC<DoctorBioModalProps> = React.memo(({ isOpen, onClose, member }) => {
  if (!isOpen) return null;

  const isYogaMember = member.id === 'devadarsan';

  return (
    <AnimatePresence>
      <div className="doc-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          className="doc-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="doc-modal-close"
            onClick={onClose}
            aria-label="Close Profile"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="doc-modal-header">
            <div className="doc-header-portrait-wrap">
              <img
                src={member.image}
                alt={member.name}
                className="doc-header-portrait"
              />
              <span className="doc-header-active-badge" title="Available for Sessions"></span>
            </div>

            <div className="doc-header-info">
              <div className="doc-header-pill">
                <Sparkles size={13} />
                <span>
                  {isYogaMember
                    ? 'Classical Yoga • Pranayama • Meditation'
                    : 'Ayurveda • Clinical Psychotherapy • Healing'}
                </span>
              </div>
              <h2 className="doc-header-name">{member.name}</h2>
              <p className="doc-header-role">{member.role}</p>
              <p className="doc-header-degrees">{member.qualifications}</p>
              {member.qualificationLine2 && (
                <p className="doc-header-degrees" style={{ marginTop: '2px' }}>{member.qualificationLine2}</p>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="doc-modal-body">
            <div className="doc-text-block">
              <h3 className="doc-section-heading">Practice Overview & Philosophy</h3>
              <p className="doc-para">{member.description}</p>
              <p className="doc-para">
                {isYogaMember
                  ? 'Guiding students and seekers in classical yoga disciplines, sukshma vyayama (joint-freeing movements), pranayama breath regulation, and restorative meditation. Focused on cultivating body awareness, mental calmness, and daily movement routines that complement Ayurvedic constitutional wellness.'
                  : 'Bringing classical Caraka Samhita methodologies and Satvavajaya Chikitsa (mind-restraining psychotherapy) into comprehensive treatment plans. Dedicated to helping individuals address root causes of psychosomatic distress, emotional trauma, and chronic lifestyle conditions without synthetic dependency.'}
              </p>
            </div>

            <div className="doc-features-grid">
              <div className="doc-feature-card">
                <div className="doc-feature-icon-wrap">
                  <Award size={18} />
                </div>
                <h4>{isYogaMember ? 'Yogic Foundation' : 'Clinical Heritage'}</h4>
                <p>
                  {isYogaMember
                    ? 'Grounded in traditional Yogic scriptures, pranayama breath science, and therapeutic alignment.'
                    : 'Decades of experience in classical Ayurvedic internal medicine, pulse diagnosis, and psychosomatic care.'}
                </p>
              </div>

              <div className="doc-feature-card">
                <div className="doc-feature-icon-wrap">
                  <Sparkles size={18} />
                </div>
                <h4>Integrative Approach</h4>
                <p>
                  {isYogaMember
                    ? 'Mindful postures and guided meditation structured in synergy with Ayurvedic health principles.'
                    : 'Personalized internal herbal protocols harmonized with guided meditation and classical yoga therapies.'}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer with Action */}
          <div className="doc-modal-footer">
            <div className="doc-footer-prompt">
              <Calendar size={18} className="text-primary-green" />
              <span>
                {isYogaMember
                  ? `Inquire about yoga & meditation sessions with ${member.name}`
                  : `Schedule a comprehensive 1-on-1 consultation with ${member.name}`}
              </span>
            </div>
            <BookAppointmentButton
              size="md"
              variant="primary"
              label={isYogaMember ? 'Book Yoga Session' : 'Book Consultation'}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

DoctorBioModal.displayName = 'DoctorBioModal';
