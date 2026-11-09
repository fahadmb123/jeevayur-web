import { useState, useEffect, useCallback } from 'react';
import type { Patient, PatientStatus } from '../types';
import { patientService } from '../services/patientService';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    patientService.getPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const addPatient = useCallback(async (newPatient: Omit<Patient, 'id'>) => {
    const created = await patientService.addPatient(newPatient);
    setPatients((prev) => [created, ...prev]);
    return created;
  }, []);

  const updatePatientStatus = useCallback(async (id: number | string, status: PatientStatus) => {
    setPatients((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, status } : p))
    );
    await patientService.updatePatientStatus(id, status);
  }, []);

  return {
    patients,
    loading,
    addPatient,
    updatePatientStatus,
  };
};
