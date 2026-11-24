import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useDoctorStats } from '@/features/doctor/hooks/useDoctorStats';
import { INITIAL_STATS } from '@/features/doctor/services/doctorService';
import type { DoctorStatItem } from '@/features/doctor/types';
import './DoctorStats.css';

export interface DoctorStatsProps {
  stats?: DoctorStatItem[];
}

export const DoctorStats: React.FC<DoctorStatsProps> = React.memo(({ stats: propStats }) => {
  const navigate = useNavigate();
  const { stats: hookStats } = useDoctorStats();
  const stats = React.useMemo(() => {
    if (propStats && propStats.length > 0) return propStats;
    if (hookStats && hookStats.length > 0) return hookStats;
    return INITIAL_STATS;
  }, [propStats, hookStats]);

  return (
    <div className="doctor-stats-grid">
      {stats.map((item, idx) => {
        const hasAction = Boolean(item.onClick || item.link);
        const handleClick = item.onClick
          ? item.onClick
          : item.link
          ? () => navigate(item.link!)
          : undefined;

        return (
          <motion.div
            key={item.id}
            className={`doctor-stat-card doctor-stat-card--${item.variant} ${hasAction ? 'doctor-stat-card--clickable' : ''}`}
            onClick={handleClick}
            role={hasAction ? 'button' : undefined}
            tabIndex={hasAction ? 0 : undefined}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            whileHover={hasAction ? { y: -4, transition: { duration: 0.2 } } : undefined}
            onKeyDown={
              hasAction
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClick?.();
                    }
                  }
                : undefined
            }
          >
            <div className="doctor-stat-card__top">
              <div className="doctor-stat-card__icon-wrapper">
                {item.icon}
              </div>
              {hasAction && (
                <span className="doctor-stat-card__action-hint" title="Open section">
                  <ArrowUpRight size={14} />
                </span>
              )}
            </div>

            <div className="doctor-stat-card__content">
              <span className="doctor-stat-card__title">{item.title}</span>
              <span className="doctor-stat-card__value">{item.value}</span>
              <div className="doctor-stat-card__trend-pill">
                <span className="doctor-stat-card__trend-dot" />
                <span className="doctor-stat-card__trend">{item.trend}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

DoctorStats.displayName = 'DoctorStats';
