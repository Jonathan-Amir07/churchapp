'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const rawRole = profile?.role as string | undefined;
  const role = rawRole as 'admin' | 'instructor' | undefined;
  
  if (!role || !NAV_ITEMS[role]) return null;

  const items = NAV_ITEMS[role];

  // Helper to check if a route is active
  const isActive = (href: string) => {
    // Strip locale prefix if present in pathname to match the href
    const segments = pathname.split('/');
    const cleanPath = ['en', 'ar'].includes(segments[1])
      ? '/' + segments.slice(2).join('/')
      : pathname;
    
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  return (
    <aside className="w-64 bg-surface-container-low border-e border-outline-variant hidden md:flex flex-col h-screen sticky top-0 z-30 shadow-md">
      {/* Brand logo header */}
      <div className="h-14 flex items-center px-4 border-b border-outline-variant/50 bg-surface-container-low gap-3">
        <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-on-primary">
            <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight text-on-surface">
          {tCommon('appName')} <span className="text-xs text-primary ml-1">{role === 'admin' ? 'Admin' : 'Instructor'}</span>
        </span>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 border-b border-outline-variant/30">
        <Button variant="primary" fullWidth size="sm" className="font-bold flex items-center gap-2 justify-center">
          <span className="material-symbols-outlined text-[18px]">add</span>
          إجراء سريع
        </Button>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors duration-150 group select-none',
                active
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[18px]',
                  active ? 'text-on-primary' : 'text-outline group-hover:text-primary'
                )}
                style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span>{tNav(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status / Quick Info */}
      <div className="mx-3 mb-3 mt-2">
        <div className="bg-surface-container-lowest p-3 rounded-md border border-outline-variant/50 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-on-surface-variant">حالة النظام</span>
            <span className="text-green-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
              مستقر
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">تحديث البيانات</span>
            <span className="text-on-surface font-bold">الآن</span>
          </div>
        </div>
      </div>

      {/* Footer / version info */}
      <div className="p-3 border-t border-outline-variant/60 flex items-center justify-between text-[11px] text-on-surface-variant font-medium bg-surface-container-lowest">
        <span>&copy; {year || ''} JoyfulPath ERP</span>
        <span>v2.1.0</span>
      </div>
    </aside>
  );
}
