'use client';

import { useUser } from '@/hooks/useUser';
import { Sidebar } from './Sidebar';
import { AdminSidebar } from './AdminSidebar';

export function DashboardSidebar() {
  const { profile } = useUser();
  const role = profile?.role as string | undefined;

  if (role === 'admin' || role === 'instructor') {
    return <AdminSidebar />;
  }

  return <Sidebar />;
}
