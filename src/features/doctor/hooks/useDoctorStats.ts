import { useState, useEffect, useCallback } from 'react';
import { doctorService, INITIAL_STATS } from '../services/doctorService';
import type { DoctorStatItem } from '../types';

export const useDoctorStats = () => {
  const [stats, setStats] = useState<DoctorStatItem[]>(INITIAL_STATS);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await doctorService.getStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    doctorService.getStats().then((data) => {
      if (mounted) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, refreshStats };
};
