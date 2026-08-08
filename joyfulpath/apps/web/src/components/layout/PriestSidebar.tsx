'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PriestSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/priest/dashboard' },
    { label: 'Families', icon: 'family_restroom', href: '/priest/families' },
    { label: 'Students', icon: 'school', href: '/priest/students' },
    { label: 'Attendance', icon: 'fact_check', href: '/priest/attendance' },
    { label: 'Reports', icon: 'bar_chart', href: '/priest/reports' },
    { label: 'Progress', icon: 'trending_up', href: '/priest/progress' },
  ];

  return (
    <div className="hidden md:flex w-64 bg-surface-container-low border-r border-outline-variant flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 font-bold text-xl text-primary border-b border-outline-variant">
        Priest Portal
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary text-on-primary font-bold shadow-md' 
                  : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
