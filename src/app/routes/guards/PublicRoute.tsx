import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/config/routes';
import { LoadingScreen } from '@/shared/ui';

export interface PublicRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
  restricted?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo,
  restricted = true,
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  if (restricted && isAuthenticated) {
    const destination =
      redirectTo ||
      (location.state as { from?: Location })?.from?.pathname ||
      (user?.role === 'doctor' ? ROUTES.DOCTOR : ROUTES.HOME);

    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

PublicRoute.displayName = 'PublicRoute';

