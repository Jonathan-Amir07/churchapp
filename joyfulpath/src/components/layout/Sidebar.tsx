'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const role = session?.user?.role as 'student' | 'instructor' | 'admin' | undefined;
  
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
      <div className="h-16 flex items-center px-6 border-b border-outline-variant/60 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_stories
          </span>
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
                'flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 group select-none',
                active
                  ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,88,190,0.15)]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-105',
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

      {/* Footer / version info */}
      <div className="p-4 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant/50 font-bold">
        &copy; {new Date().getFullYear()} {tCommon('appName')}
      </div>
    </aside>
  );
}
export default Sidebar;
