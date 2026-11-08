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
    return <LoadingScreen fullScreen message="Verifying session..." />;
  }

  if (restricted && isAuthenticated) {
    const rawFrom = (location.state as { from?: Location | string })?.from;
    const fromPath = typeof rawFrom === 'string' ? rawFrom : rawFrom?.pathname;
    const isAuthPath =
      fromPath &&
      (fromPath === ROUTES.LOGIN ||
        fromPath === ROUTES.REGISTER ||
        fromPath === ROUTES.FORGOT_PASSWORD ||
        fromPath === ROUTES.RESET_PASSWORD);

    const fallback = user?.role === 'doctor' ? ROUTES.DOCTOR : ROUTES.HOME;
    const destination = redirectTo || (!isAuthPath && fromPath) || fallback;

    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

PublicRoute.displayName = 'PublicRoute';

