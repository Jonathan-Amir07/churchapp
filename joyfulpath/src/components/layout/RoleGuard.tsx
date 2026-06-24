'use client';

import { useSession } from 'next-auth/react';
import { type ReactNode } from 'react';

export interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null; // or a tiny loader
  }

  const userRole = session?.user?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
export default RoleGuard;
