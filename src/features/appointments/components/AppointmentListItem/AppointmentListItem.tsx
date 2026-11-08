import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, CheckCircle2 } from 'lucide-react';
import type { Appointment } from '@/features/appointments/types';
import './AppointmentListItem.css';

export interface AppointmentListItemProps {
  appointment: Appointment;
  onStart?: (appointment: Appointment) => void;
}

export const AppointmentListItem: React.FC<AppointmentListItemProps> = React.memo(({
  appointment,
  onStart,
}) => {
  const isNext = appointment.status === 'next';

  return (
    <motion.div
      className={`appointment-item ${isNext ? 'appointment-item--active' : ''}`}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="appointment-item__time-block">
        <span className="appointment-item__time-main">{appointment.time}</span>
        <span className="appointment-item__time-meridian">{appointment.meridian}</span>
      </div>
      <div className="appointment-item__details">
        <div className="appointment-item__header-row">
          <span className="appointment-item__name">{appointment.patient}</span>
          {isNext && <span className="appointment-item__pulse" />}
        </div>
        <span className="appointment-item__type">
          {appointment.isVideo ? (
            <Video size={14} className="appointment-item__type-icon" />
          ) : (
            <Clock size={14} className="appointment-item__type-icon" />
          )}
          {appointment.type}
        </span>
      </div>
      {isNext ? (
        <button
          className="appointment-item__start-btn"
          onClick={() => onStart?.(appointment)}
        >
          Start
        </button>
      ) : (
        <CheckCircle2 size={20} className="appointment-item__check-icon" />
      )}
    </motion.div>
  );
});

AppointmentListItem.displayName = 'AppointmentListItem';
