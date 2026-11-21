import React from 'react';
import { motion } from 'framer-motion';
import { TeamMemberCard } from '../TeamMemberCard';
import { useTeam } from '../../hooks/useTeam';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './TeamSection.css';

export interface TeamSectionProps {
  limit?: number;
  hideHeader?: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = React.memo(({ limit = 2, hideHeader = false }) => {
  const { members } = useTeam();
  const expertMembers = limit ? members.slice(0, limit) : members;

  return (
    <section id="team" className={`team-section ${hideHeader ? 'team-section--compact' : ''}`}>
      {!hideHeader && (
        <motion.div
          className="team-header text-center"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <motion.h4 className="section-subtitle" variants={fadeUpVariants}>Our Team</motion.h4>
          <motion.h2 className="section-title" variants={fadeUpVariants}>Meet Our Practitioners</motion.h2>
          <motion.p className="team-subtitle" variants={fadeUpVariants}>
            Dedicated practitioners bringing you the time-tested wisdom of Ayurveda and classical yoga disciplines.
          </motion.p>
        </motion.div>
      )}

      <motion.div
        className="team-grid"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        {expertMembers.map((member, index) => (
          <TeamMemberCard key={member.id} member={member} index={index} />
        ))}
      </motion.div>
    </section>
  );
});

TeamSection.displayName = 'TeamSection';
