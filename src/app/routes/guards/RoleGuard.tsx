import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/config/routes';
import { LoadingScreen } from '@/shared/ui';

export interface RoleGuardProps {
  children?: React.ReactNode;
  allowedRoles: Array<'doctor' | 'patient' | 'admin'>;
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = ROUTES.HOME,
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

RoleGuard.displayName = 'RoleGuard';

