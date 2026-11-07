import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AUTH_QUERY_KEY } from './useAuthMutation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, error } = useQuery({ queryKey: AUTH_QUERY_KEY, queryFn: authService.getCurrentUser, retry: false });

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
