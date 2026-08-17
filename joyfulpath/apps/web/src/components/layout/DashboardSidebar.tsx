'use client';

import { useUser } from '@/hooks/useUser';
import { Sidebar } from './Sidebar';
import { AdminSidebar } from './AdminSidebar';
import { PriestSidebar } from './PriestSidebar';
import { InstructorSidebar } from './InstructorSidebar';

export function DashboardSidebar() {
  const { profile } = useUser();
  const role = profile?.role as string | undefined;

  if (role === 'admin') return <AdminSidebar />;
  if (role === 'priest') return <PriestSidebar />;
  if (role === 'instructor') return <InstructorSidebar />;

  return <Sidebar />;
}
