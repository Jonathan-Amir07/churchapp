'use client';

import { useUser } from '@/hooks/useUser';
import { type ReactNode } from 'react';

export interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
  const { profile, loading } = useUser();

  if (loading) {
    return null; // or a tiny loader
  }

  const userRole = profile?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }


  return <>{children}</>;
}
export default RoleGuard;
