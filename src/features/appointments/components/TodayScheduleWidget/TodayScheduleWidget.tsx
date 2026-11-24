import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Inbox } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { AppointmentListItem } from '../AppointmentListItem';
import { AppointmentListItemSkeleton } from '../AppointmentListItemSkeleton';
import { StartConsultationModal } from '@/features/patients';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import type { Appointment } from '@/features/appointments/types';
import { ROUTES } from '@/shared/config/routes';
import './TodayScheduleWidget.css';

export interface TodayScheduleWidgetProps {
  appointments?: Appointment[];
  isLoading?: boolean;
  onOpenCalendar?: () => void;
  onStartAppointment?: (appointment: Appointment) => void;
  onViewDetails?: (appointment: Appointment) => void;
  onConsultationComplete?: (appointment: Appointment) => void;
  variants?: Variants;
}

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = React.memo(({
  appointments: propAppointments,
  isLoading: propIsLoading,
  onOpenCalendar,
  onStartAppointment,
  onViewDetails,
  onConsultationComplete,
  variants,
}) => {
  const navigate = useNavigate();
  const { appointments: hookAppointments, loading: hookLoading, completeAppointment } = useAppointments();
  const appointments = React.useMemo(
    () => propAppointments || hookAppointments,
    [propAppointments, hookAppointments]
  );
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookLoading;

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleStart = React.useCallback(
    (apt: Appointment) => {
      if (onStartAppointment) {
        onStartAppointment(apt);
      } else {
        setSelectedAppointment(apt);
      }
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
              <div className="today-schedule-widget__title-row">
                <h2 className="today-schedule-widget__title">Today's Schedule</h2>
                <span className="today-schedule-widget__badge">
                  {appointments.length} Sessions
                </span>
              </div>
              <span className="today-schedule-widget__subtitle">
                Scheduled consultations & therapy sessions
              </span>
            </div>
            <button
              type="button"
              className="today-schedule-widget__calendar-btn"
              onClick={onOpenCalendar || (() => navigate(ROUTES.DOCTOR_REQUESTS))}
            >
              <Inbox size={13} />
              <span>Inbound Requests</span>
            </button>
          </div>

          <div className="today-schedule-widget__list">
            {isLoading ? (
              <AppointmentListItemSkeleton count={3} />
            ) : appointments.length > 0 ? (
              appointments.map((apt) => (
                <AppointmentListItem
                  key={apt.id}
                  appointment={apt}
                  onStart={handleStart}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <div className="today-schedule-widget__empty">
                <div className="today-schedule-widget__empty-icon-wrap">
                  <CalendarClock size={28} />
                </div>
                <h4 className="today-schedule-widget__empty-title">All Caught Up for Today</h4>
                <p className="today-schedule-widget__empty-sub">
                  No appointments are scheduled for today. New requests will appear in your inbound triage feed.
                </p>
                <button
                  type="button"
                  className="today-schedule-widget__empty-btn"
                  onClick={onOpenCalendar || (() => navigate(ROUTES.DOCTOR_REQUESTS))}
                >
                  <Inbox size={14} />
                  <span>Review Inbound Requests</span>
                </button>
              </div>
            )}
          </div>
        </Card>
      </motion.section>

      {!onStartAppointment && (
        <StartConsultationModal
          appointment={selectedAppointment}
          isOpen={Boolean(selectedAppointment)}
          onClose={handleClose}
          onComplete={handleConsultationFinished}
        />
      )}
    </>
  );
});

TodayScheduleWidget.displayName = 'TodayScheduleWidget';
