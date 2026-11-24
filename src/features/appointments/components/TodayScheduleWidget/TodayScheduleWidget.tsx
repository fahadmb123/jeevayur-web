import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/ui/card';
import { AppointmentListItem } from '../AppointmentListItem';
import { StartConsultationModal } from '@/features/patients';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import type { Appointment } from '@/features/appointments/types';
import { ROUTES } from '@/shared/config/routes';
import './TodayScheduleWidget.css';

export interface TodayScheduleWidgetProps {
  appointments?: Appointment[];
  onOpenCalendar?: () => void;
  onStartAppointment?: (appointment: Appointment) => void;
  onConsultationComplete?: (appointment: Appointment) => void;
  variants?: Variants;
}

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = React.memo(({
  appointments: propAppointments,
  onOpenCalendar,
  onStartAppointment,
  onConsultationComplete,
  variants,
}) => {
  const navigate = useNavigate();
  const { appointments: hookAppointments, completeAppointment } = useAppointments();
  const appointments = React.useMemo(
    () => propAppointments || hookAppointments,
    [propAppointments, hookAppointments]
  );

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleStart = React.useCallback(
    (apt: Appointment) => {
      setSelectedAppointment(apt);
      onStartAppointment?.(apt);
    },
    [onStartAppointment]
  );

  const handleClose = React.useCallback(() => {
    setSelectedAppointment(null);
  }, []);

  const handleConsultationFinished = React.useCallback(
    async (appointmentId: number | string) => {
      if (!selectedAppointment) return;
      await completeAppointment(appointmentId);
      onConsultationComplete?.(selectedAppointment);
      setSelectedAppointment(null);
    },
    [selectedAppointment, completeAppointment, onConsultationComplete]
  );

  return (
    <>
      <motion.section variants={variants} className="today-schedule-widget">
        <Card className="today-schedule-widget__card">
          <div className="today-schedule-widget__header">
            <div>
              <h2 className="today-schedule-widget__title">Today's Schedule</h2>
              <span className="today-schedule-widget__subtitle">
                {appointments.length} clinical appointments for today
              </span>
            </div>
            <button
              type="button"
              className="today-schedule-widget__calendar-btn"
              onClick={onOpenCalendar || (() => navigate(ROUTES.DOCTOR_REQUESTS))}
            >
              Inbound Requests
            </button>
          </div>

          <div className="today-schedule-widget__list">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <AppointmentListItem
                  key={apt.id}
                  appointment={apt}
                  onStart={handleStart}
                />
              ))
            ) : (
              <div className="today-schedule-widget__empty">
                <p>No appointments scheduled for today.</p>
                <button
                  type="button"
                  className="today-schedule-widget__empty-btn"
                  onClick={() => navigate(ROUTES.DOCTOR_REQUESTS)}
                >
                  Review Inbound Requests
                </button>
              </div>
            )}
          </div>
        </Card>
      </motion.section>

      <StartConsultationModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={handleClose}
        onComplete={handleConsultationFinished}
      />
    </>
  );
});

TodayScheduleWidget.displayName = 'TodayScheduleWidget';
