'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface NavItem {
  key: string;
  icon: string;
  href: string;
  label?: string;
}

interface SidebarShellProps {
  items: NavItem[];
  roleLabel: string;
}

export function SidebarShell({ items, roleLabel }: SidebarShellProps) {
  const pathname = usePathname();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const isActive = (href: string) => {
    const segments = pathname.split('/');
    const clean = ['en', 'ar'].includes(segments[1])
      ? '/' + segments.slice(2).join('/')
      : pathname;
    return clean === href || clean.startsWith(href + '/');
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'ACCESS_TOKEN=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.replace('/login');
  };

  return (
    <aside className="w-64 bg-surface-container-low border-s border-outline-variant/50 flex flex-col h-screen fixed end-0 top-0 z-30 shadow-elevated">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-outline-variant/40 gap-3 bg-surface-container-lowest">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-secondary">
            <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-primary truncate leading-tight">
            نوصل ونوصل للسماء
          </span>
          <span className="text-[10px] font-semibold text-on-surface-variant">{roleLabel}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          let label: string;
          try {
            label = item.label || tNav(item.key);
          } catch {
            label = item.label || item.key;
          }
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 group',
                active
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px] shrink-0',
                  active ? 'text-secondary' : 'text-outline group-hover:text-primary'
                )}
                style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="truncate">{label}</span>
              {active && (
                <span className="ms-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-outline-variant/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-error hover:bg-error/10 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {(() => { try { return tCommon('logout'); } catch { return 'تسجيل الخروج'; } })()}
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-outline">
        <span>© {year || ''} نوصل للسماء</span>
        <span>v2.1.0</span>
      </div>
    </aside>
  );
}
