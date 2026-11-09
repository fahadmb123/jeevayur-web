import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PatientRequest } from '../types';
import { requestService } from '../services/requestService';

export const useRequests = () => {
  const [requests, setRequests] = useState<PatientRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await requestService.getRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();

    const unsubscribe = requestService.subscribe((updated) => {
      setRequests(updated);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchRequests]);

  const acceptRequest = useCallback(async (id: string) => {
    const updated = await requestService.acceptRequest(id);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const rejectRequest = useCallback(async (id: string, reason?: string) => {
    const updated = await requestService.rejectRequest(id, reason);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const { pendingCount, acceptedCount, rejectedCount } = useMemo(() => {
    let pending = 0;
    let accepted = 0;
    let rejected = 0;
    for (const r of requests) {
      if (r.status === 'pending') pending++;
      else if (r.status === 'accepted') accepted++;
      else if (r.status === 'rejected') rejected++;
    }
    return {
      pendingCount: pending,
      acceptedCount: accepted,
      rejectedCount: rejected,
    };
  }, [requests]);

  return {
    requests,
    loading,
    pendingCount,
    acceptedCount,
    rejectedCount,
    acceptRequest,
    rejectRequest,
    refresh: fetchRequests,
  };
};

export const useConsultationRequests = useRequests;
