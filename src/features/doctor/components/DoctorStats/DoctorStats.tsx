import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useDoctorStats } from '@/features/doctor/hooks/useDoctorStats';
import type { DoctorStatItem } from '@/features/doctor/types';
import './DoctorStats.css';

export interface DoctorStatsProps {
  stats?: DoctorStatItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const DoctorStats: React.FC<DoctorStatsProps> = React.memo(({ stats: propStats }) => {
  const navigate = useNavigate();
  const { stats: hookStats } = useDoctorStats();
  const stats = React.useMemo(() => propStats || hookStats, [propStats, hookStats]);

  return (
    <motion.div
      className="doctor-stats-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {stats.map((item) => {
        const handleClick = item.link ? () => navigate(item.link!) : undefined;

        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            className={`doctor-stat-card doctor-stat-card--${item.variant} ${item.link ? 'doctor-stat-card--clickable' : ''}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
            role={item.link ? 'button' : undefined}
            tabIndex={item.link ? 0 : undefined}
            onKeyDown={
              item.link
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(item.link!);
                    }
                  }
                : undefined
            }
          >
            <div className="doctor-stat-card__content">
              <span className="doctor-stat-card__title">{item.title}</span>
              <span className="doctor-stat-card__value">{item.value}</span>
              <span className="doctor-stat-card__trend">{item.trend}</span>
            </div>
            <div className="doctor-stat-card__icon-wrapper">
              {item.icon}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

DoctorStats.displayName = 'DoctorStats';
