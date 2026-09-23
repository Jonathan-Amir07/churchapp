'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/app.store';
import { AdminSidebar } from './AdminSidebar';
import { PriestSidebar } from './PriestSidebar';
import { InstructorSidebar } from './InstructorSidebar';
import { StudentSidebar } from './StudentSidebar';
import { ParentSidebar } from './ParentSidebar';

type Role = 'admin' | 'priest' | 'instructor' | 'parent' | 'student';

function getRoleFromCookie(): Role | null {
  try {
    const match = document.cookie.match(new RegExp('(^| )ACCESS_TOKEN=([^;]+)'));
    if (!match) return null;
    const token = match[2];
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.role as Role;
  } catch {
    return null;
  }
}

export function DashboardSidebar() {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useAppStore();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    setRole(getRoleFromCookie());
  }, []);

  useEffect(() => {
    if (isMobileSidebarOpen) toggleMobileSidebar(false);
  }, [pathname]);

  const renderSidebar = () => {
    switch (role) {
      case 'admin':      return <AdminSidebar />;
      case 'priest':     return <PriestSidebar />;
      case 'instructor': return <InstructorSidebar />;
      case 'parent':     return <ParentSidebar />;
      case 'student':    return <StudentSidebar />;
      default:           return null;
    }
  };

  if (!role) return null;

  return (
    <>
      <div className="hidden md:block">
        {renderSidebar()}
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => toggleMobileSidebar(false)}
          />
          <div className="relative ms-auto flex w-72 max-w-xs flex-col shadow-xl animate-[slide-in-right_0.3s_ease-out]">
            <div className="h-full w-full [&>aside]:!flex [&>aside]:!w-full [&>aside]:!relative [&>aside]:!end-auto">
              {renderSidebar()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
