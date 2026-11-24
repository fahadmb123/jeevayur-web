import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorStats } from '@/features/doctor/hooks/useDoctorStats';
import type { DoctorStatItem } from '@/features/doctor/types';
import './DoctorStats.css';

export interface DoctorStatsProps {
  stats?: DoctorStatItem[];
}

export const DoctorStats: React.FC<DoctorStatsProps> = React.memo(({ stats: propStats }) => {
  const navigate = useNavigate();
  const { stats: hookStats } = useDoctorStats();
  const stats = React.useMemo(() => propStats || hookStats, [propStats, hookStats]);

  return (
    <div className="doctor-stats-grid">
      {stats.map((item) => {
        const hasAction = Boolean(item.onClick || item.link);
        const handleClick = item.onClick
          ? item.onClick
          : item.link
          ? () => navigate(item.link!)
          : undefined;

        return (
          <div
            key={item.id}
            className={`doctor-stat-card doctor-stat-card--${item.variant} ${hasAction ? 'doctor-stat-card--clickable' : ''}`}
            onClick={handleClick}
            role={hasAction ? 'button' : undefined}
            tabIndex={hasAction ? 0 : undefined}
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
            <div className="doctor-stat-card__content">
              <span className="doctor-stat-card__title">{item.title}</span>
              <span className="doctor-stat-card__value">{item.value}</span>
              <span className="doctor-stat-card__trend">{item.trend}</span>
            </div>
            <div className="doctor-stat-card__icon-wrapper">
              {item.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
});

DoctorStats.displayName = 'DoctorStats';
