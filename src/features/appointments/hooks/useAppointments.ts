import { useState, useEffect, useCallback } from 'react';
import type { Appointment } from '../types';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    appointmentService.getAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  const completeAppointment = useCallback(async (id: number | string, notes?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (String(apt.id) === String(id) ? { ...apt, status: 'completed', notes } : apt))
    );
    await appointmentService.completeAppointment(id, notes);
  }, []);

  return {
    appointments,
    loading,
    refreshAppointments,
    completeAppointment,
  };
};
