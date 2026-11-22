import { useState, useEffect, useCallback } from 'react';
import type { PatientRequest } from '../types';
import { requestService, type RequestFilterQuery, type RequestCounts } from '../services/requestService';

export const useRequests = (query?: RequestFilterQuery) => {
  const [requests, setRequests] = useState<PatientRequest[]>([]);
  const [counts, setCounts] = useState<RequestCounts>({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  const queryKey = JSON.stringify(query || {});

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await requestService.getRequests(query);
      setRequests(res.requests);
      setCounts(res.counts);
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const acceptRequest = useCallback(async (id: string) => {
    const updated = await requestService.acceptRequest(id);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    await fetchRequests();
    return updated;
  }, [fetchRequests]);

  const rejectRequest = useCallback(async (id: string, reason?: string) => {
    const updated = await requestService.rejectRequest(id, reason);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    await fetchRequests();
    return updated;
  }, [fetchRequests]);

  return {
    requests,
    loading,
    totalCount: counts.all,
    pendingCount: counts.pending,
    acceptedCount: counts.accepted,
    rejectedCount: counts.rejected,
    acceptRequest,
    rejectRequest,
    refresh: fetchRequests,
  };
};

export const useConsultationRequests = useRequests;
