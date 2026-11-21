import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AUTH_QUERY_KEY } from './useAuthMutation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [queryClient]);

  return {
    user,
    isAuthenticated: !!user,
    loading: isPending,
    error,
    logout: async () => {
      await authService.logout();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  };
};
