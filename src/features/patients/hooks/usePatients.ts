import { useState, useEffect, useCallback, useRef } from 'react';
import type { Patient, PatientStatus } from '../types';
import { patientService, type PatientFilterQuery } from '../services/patientService';

export const usePatients = (initialQuery?: PatientFilterQuery) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [counts, setCounts] = useState<{ All: number; Completed: number; Uncompleted: number }>({
    All: 0,
    Completed: 0,
    Uncompleted: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const queryRef = useRef<PatientFilterQuery | undefined>(initialQuery);
  queryRef.current = initialQuery;

  const fetchPatients = useCallback(async (query?: PatientFilterQuery) => {
    setLoading(true);
    try {
      const res = await patientService.getPatients(query ?? queryRef.current);
      setPatients(res.patients);
      setTotal(res.total);
      setCounts({
        All: res.counts.all,
        Completed: res.counts.completed,
        Uncompleted: res.counts.uncompleted,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients(initialQuery);
  }, [
    initialQuery?.search,
    initialQuery?.status,
    initialQuery?.gender,
    initialQuery?.source,
    initialQuery?.limit,
    initialQuery?.page,
    fetchPatients,
  ]);

  const addPatient = useCallback(async (newPatient: Omit<Patient, 'id'>) => {
    const created = await patientService.addPatient(newPatient);
    setPatients((prev) => [created, ...prev]);
    setCounts((prev) => ({
      ...prev,
      All: prev.All + 1,
      Uncompleted: prev.Uncompleted + 1,
    }));
    return created;
  }, []);

  const updatePatientStatus = useCallback(async (id: number | string, status: PatientStatus) => {
    setPatients((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, status } : p))
    );
    setCounts((prev) => {
      const isComplete = status === 'Completed';
      return {
        ...prev,
        Completed: isComplete ? prev.Completed + 1 : Math.max(0, prev.Completed - 1),
        Uncompleted: isComplete ? Math.max(0, prev.Uncompleted - 1) : prev.Uncompleted + 1,
      };
    });
    await patientService.updatePatientStatus(id, status);
  }, []);

  return {
    patients,
    total,
    counts,
    loading,
    fetchPatients,
    addPatient,
    updatePatientStatus,
  };
};
