'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const role = profile?.role as 'student' | 'instructor' | 'admin' | 'parent' | undefined;
  
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
    <aside className="w-64 bg-surface-container-lowest border-e border-outline-variant hidden md:flex flex-col h-screen sticky top-0 z-30 shadow-sm">
      {/* Brand logo header */}
      <div className="h-16 flex items-center px-6 border-b border-secondary/20 bg-surface-container-low gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-secondary/50 shadow-[0_0_10px_rgba(201,168,76,0.3)]">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary">
            <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-lg font-black tracking-tight text-primary">
          {tCommon('appName')}
        </span>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 group select-none relative overflow-hidden',
                active
                  ? 'bg-primary/5 text-primary border border-secondary/50 shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-transparent'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-105',
                  active ? 'text-secondary' : 'text-outline group-hover:text-primary'
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

      {/* Verse of the Day Widget */}
      <div className="mx-4 mb-4 mt-2">
        <div className="bg-surface-container p-4 rounded-xl border border-secondary/20 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-coptic-pattern opacity-10 pointer-events-none" />
          <h4 className="text-xs font-bold text-secondary flex items-center gap-1.5 mb-2 relative z-10">
            <span className="material-symbols-outlined text-[14px]">menu_book</span>
            آية اليوم
          </h4>
          <p className="text-[11px] font-bold leading-relaxed text-on-surface-variant relative z-10">
            "فَرَحًا أَفْرَحُ بِالرَّبِّ، تَبْتَهِجُ نَفْسِي بِإِلهِي..."
          </p>
          <p className="text-[9px] text-outline mt-1 font-bold relative z-10">(إشعياء 61: 10)</p>
        </div>
      </div>

      {/* Footer / version info */}
      <div className="p-3 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant/50 font-bold bg-surface-container-lowest">
        &copy; {year || ''} {tCommon('appName')}
      </div>
    </aside>
  );
}
export default Sidebar;
