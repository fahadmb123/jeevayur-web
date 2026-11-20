import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Compass } from 'lucide-react';
import type { TeamMember } from '../types';
import { fadeUpVariants } from '@/shared/lib/animations';
import './TeamMemberCard.css';

const DrAhalyaModal = React.lazy(() =>
  import('./DrAhalyaModal').then((m) => ({ default: m.DrAhalyaModal }))
);

const DoctorBioModal = React.lazy(() =>
  import('./DoctorBioModal').then((m) => ({ default: m.DoctorBioModal }))
);

export interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
}

interface DoctorStyleConfig {
  bgColor: string;
  category: string;
  icon: React.ReactNode;
}

const DOCTOR_STYLES: Record<string, DoctorStyleConfig> = {
  'dr-ahalya': {
    bgColor: '#124C38',
    category: 'AYURVEDA & WELLNESS CONSULTANT',
    icon: <Sparkles size={24} color="#FFFFFF" strokeWidth={2.2} />,
  },
  'devadarsan': {
    bgColor: '#1D3B53',
    category: 'YOGA & MEDITATION TEACHER',
    icon: <Compass size={24} color="#FFFFFF" strokeWidth={2.2} />,
  },
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = React.memo(({ member }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const styleConfig: DoctorStyleConfig = DOCTOR_STYLES[member.id] || {
    bgColor: '#1B6B50',
    category: 'AYURVEDIC PHYSICIAN',
    icon: <Sparkles size={20} color="#FFFFFF" strokeWidth={2.2} />,
  };

  return (
    <>
      <motion.article
        className="team-card"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        whileHover={{ y: -6 }}
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Explore profile of ${member.name}`}
      >
        <div className="team-card__image-box">
          <img
            src={member.image}
            alt={member.name}
            className="team-card__img"
            loading="lazy"
            decoding="async"
          />
          <div className="team-card__image-overlay" />

          <div className="team-card__floating-chip">
            <span>
              {member.qualifications}
              {member.qualificationLine2 ? ` • ${member.qualificationLine2}` : ''}
            </span>
          </div>
        </div>

        <div className="team-card__meta-bar">
          <div
            className="team-card__avatar-badge"
            style={{ backgroundColor: styleConfig.bgColor }}
            aria-hidden="true"
          >
            {styleConfig.icon}
          </div>

          <div className="team-card__text-group">
            <h3 className="team-card__name">{member.name}</h3>
            <span className="team-card__category">{styleConfig.category}</span>
          </div>

          <div className="team-card__action-btn" aria-hidden="true">
            <ArrowUpRight size={24} strokeWidth={2.6} />
          </div>
        </div>
      </motion.article>

      {isModalOpen && (
        <Suspense fallback={null}>
          {member.id === 'dr-ahalya' ? (
            <DrAhalyaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          ) : (
            <DoctorBioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} member={member} />
          )}
        </Suspense>
      )}
    </>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';
