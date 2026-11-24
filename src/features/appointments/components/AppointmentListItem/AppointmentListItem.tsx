import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, CheckCircle2 } from 'lucide-react';
import type { Appointment } from '@/features/appointments/types';
import './AppointmentListItem.css';

export interface AppointmentListItemProps {
  appointment: Appointment;
  onStart?: (appointment: Appointment) => void;
  onViewDetails?: (appointment: Appointment) => void;
}

export const AppointmentListItem: React.FC<AppointmentListItemProps> = React.memo(({
  appointment,
  onStart,
  onViewDetails,
}) => {
  const isNext = appointment.status === 'next';
  const isDone = appointment.status === 'completed';

  const handleRowClick = () => {
    onViewDetails?.(appointment);
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart?.(appointment);
  };

  return (
    <motion.div
      className={`appointment-item ${isNext ? 'appointment-item--active' : ''} ${isDone ? 'appointment-item--done' : ''}`}
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
    >
      <div className="appointment-item__time-block">
        <span className="appointment-item__time-main">{appointment.time}</span>
        <span className="appointment-item__time-meridian">{appointment.meridian}</span>
      </div>

      <div className="appointment-item__details">
        <div className="appointment-item__header-row">
          <span className="appointment-item__name">{appointment.patient}</span>
          {isNext && <span className="appointment-item__pulse" title="Next upcoming session" />}
          {appointment.isVideo && (
            <span className="appointment-item__video-pill">
              <Video size={11} />
              <span>Video</span>
            </span>
          )}
        </div>
        <span className="appointment-item__type">
          <Clock size={13} className="appointment-item__type-icon" />
          <span>{appointment.type}</span>
          {appointment.reason && (
            <span className="appointment-item__reason-snip">
              • {appointment.reason}
            </span>
          )}
        </span>
      </div>

      <div className="appointment-item__actions-col">
        {isDone ? (
          <span className="appointment-item__done-badge">
            <CheckCircle2 size={13} />
            <span>Done</span>
          </span>
        ) : (
          <button
            type="button"
            className="appointment-item__start-btn"
            onClick={handleStartClick}
            title={isNext ? 'Start consultation immediately' : 'Begin session with patient'}
          >
            Start
          </button>
        )}
      </div>
    </motion.div>
  );
});

AppointmentListItem.displayName = 'AppointmentListItem';
