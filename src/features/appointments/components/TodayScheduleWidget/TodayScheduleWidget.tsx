import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card } from '@/shared/ui/card';
import { AppointmentListItem } from '../AppointmentListItem';
import { StartConsultationModal } from '@/features/patients';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import type { Appointment } from '@/features/appointments/types';
import './TodayScheduleWidget.css';

export interface TodayScheduleWidgetProps {
  appointments?: Appointment[];
  onOpenCalendar?: () => void;
  onStartAppointment?: (appointment: Appointment) => void;
  variants?: Variants;
}

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = React.memo(({
  appointments: propAppointments,
  onOpenCalendar,
  onStartAppointment,
  variants,
}) => {
  const { appointments: hookAppointments } = useAppointments();
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

  return (
    <>
      <motion.section variants={variants} className="today-schedule-widget">
        <Card className="today-schedule-widget__card">
          <div className="today-schedule-widget__header">
            <h2 className="today-schedule-widget__title">Today's Schedule</h2>
            <button className="today-schedule-widget__calendar-btn" onClick={onOpenCalendar}>
              Calendar
            </button>
          </div>
          <div className="today-schedule-widget__list">
            {appointments.map((apt) => (
              <AppointmentListItem
                key={apt.id}
                appointment={apt}
                onStart={handleStart}
              />
            ))}
          </div>
        </Card>
      </motion.section>

      <StartConsultationModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={handleClose}
      />
    </>
  );
});

TodayScheduleWidget.displayName = 'TodayScheduleWidget';
