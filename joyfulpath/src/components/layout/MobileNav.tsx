'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const tNav = useTranslations('nav');

  const role = session?.user?.role as 'student' | 'instructor' | 'admin' | undefined;
  
  if (!role || !NAV_ITEMS[role]) return null;

  const items = NAV_ITEMS[role];

  // Helper to check if active
  const isActive = (href: string) => {
    const segments = pathname.split('/');
    const cleanPath = ['en', 'ar'].includes(segments[1])
      ? '/' + segments.slice(2).join('/')
      : pathname;
    
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  return (
    <nav className="fixed bottom-0 start-0 end-0 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant md:hidden flex justify-around items-center h-16 px-2 pb-safe z-30 shadow-card">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full select-none gap-0.5 transition-all duration-150',
              active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined text-[22px]',
                active ? 'text-primary' : 'text-outline'
              )}
              style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] tracking-wide truncate max-w-[70px]">
              {tNav(item.key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
export default MobileNav;
