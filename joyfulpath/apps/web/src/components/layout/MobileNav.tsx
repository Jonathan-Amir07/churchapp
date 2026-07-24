'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavItem {
  key: string;
  icon: string;
  href: string;
}

export function MobileNav() {
  const pathname = usePathname();
  const { profile } = useUser();
  const tNav = useTranslations('nav');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const rawRole = profile?.role as string | undefined;
  const role = rawRole as 'student' | 'admin' | 'parent' | 'instructor' | undefined;
  
  // Close "more" menu when route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  if (!role || !NAV_ITEMS[role]) return null;

  const allItems = NAV_ITEMS[role] as readonly NavItem[];

  // Define which items go to bottom bar directly vs. "more" sheet
  // Maximum of 5 slots in bottom bar: 4 items + "more"
  let bottomBarItems: NavItem[] = [];
  let sheetItems: NavItem[] = [];

  if (role === 'student') {
    bottomBarItems = allItems.filter(item => 
      ['dashboard', 'lessons', 'tasks', 'games'].includes(item.key)
    );
    sheetItems = allItems.filter(item => 
      !['dashboard', 'lessons', 'tasks', 'games'].includes(item.key)
    );
  } else if (role === 'admin') {
    bottomBarItems = allItems.filter(item => 
      ['dashboard', 'users', 'classes', 'analytics'].includes(item.key)
    );
    sheetItems = allItems.filter(item => 
      !['dashboard', 'users', 'classes', 'analytics'].includes(item.key)
    );
  } else {
    // Parent has exactly 5 items, fit all directly
    bottomBarItems = [...allItems];
  }

  const hasMore = sheetItems.length > 0;

  // Helper to check if active
  const isActive = (href: string) => {
    const segments = pathname.split('/');
    const cleanPath = ['en', 'ar'].includes(segments[1])
      ? '/' + segments.slice(2).join('/')
      : pathname;
    
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  const isSheetActive = sheetItems.some(item => isActive(item.href));

  return (
    <>
      <nav className="fixed bottom-0 start-0 end-0 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant md:hidden flex justify-around items-center h-16 px-2 pb-safe z-30 shadow-card">
        {bottomBarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full select-none gap-1 transition-all duration-200 min-h-[48px]',
                active ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <div className={cn(
                'w-12 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                active ? 'bg-primary/10 border border-secondary/30' : 'bg-transparent'
              )}>
                <span
                  className={cn(
                    'material-symbols-outlined text-[24px] transition-transform duration-150',
                    active ? 'text-primary scale-110' : 'text-outline'
                  )}
                  style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}
                >
                  {item.icon}
                </span>
              </div>
              <span className={cn(
                'text-[10px] tracking-wide truncate max-w-[70px]',
                active ? 'font-black' : 'font-semibold'
              )}>
                {tNav(item.key)}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        {hasMore && (
          <button
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full select-none gap-1 transition-all duration-200 relative min-h-[48px]',
              isMoreOpen || isSheetActive ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <div className={cn(
              'w-12 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative',
              isMoreOpen || isSheetActive ? 'bg-primary/10 border border-secondary/30' : 'bg-transparent'
            )}>
              {/* Notification dot placeholder */}
              <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-error animate-pulse border border-surface-container-lowest" />
              
              <span
                className={cn(
                  'material-symbols-outlined text-[24px]',
                  isMoreOpen || isSheetActive ? 'text-primary' : 'text-outline'
                )}
                style={{ fontVariationSettings: isMoreOpen || isSheetActive ? "'FILL' 1" : undefined }}
              >
                grid_view
              </span>
            </div>
            <span className={cn(
              'text-[10px] tracking-wide truncate max-w-[70px]',
              isMoreOpen || isSheetActive ? 'font-black' : 'font-semibold'
            )}>
              {tNav('more')}
            </span>
          </button>
        )}
      </nav>

      {/* Slide-up Bottom Sheet Modal */}
      {hasMore && isMoreOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden flex items-end justify-center transition-opacity duration-300 animate-[fade-in_0.2s_ease-out]">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsMoreOpen(false)} />

          {/* Bottom Sheet Wrapper */}
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-[32px] border-t border-outline-variant/60 shadow-elevated z-50 p-6 space-y-6 relative max-h-[85vh] overflow-y-auto flex flex-col animate-[slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Grab handle indicator for touch */}
            <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto shrink-0 cursor-grab active:cursor-grabbing mb-2" onClick={() => setIsMoreOpen(false)} />

            {/* Header */}
            <div className="flex justify-between items-center shrink-0 border-b border-outline-variant/30 pb-3">
              <h3 className="text-base font-black text-on-surface">
                {tNav('more')}
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors duration-150"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Grid of Overflow Items */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 py-2 overflow-y-auto">
              {sheetItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center text-center select-none group cursor-pointer"
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border mb-2 group-hover:scale-105 group-active:scale-95',
                      active 
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                    )}>
                      <span
                        className="material-symbols-outlined text-[26px]"
                        style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <span className={cn(
                      'text-[11px] font-bold leading-tight max-w-full truncate px-1',
                      active ? 'text-primary font-black' : 'text-on-surface-variant'
                    )}>
                      {tNav(item.key)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for QR (Only for Servant and Child) */}
      {(role === 'student' || role === 'admin') && (
        <Link href={role === 'student' ? '/student/qr' : '/admin/qr'} className="fixed bottom-24 end-4 z-40 md:hidden">
          <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-elevated flex items-center justify-center hover:bg-primary-container hover:scale-105 active:scale-95 transition-all border-2 border-secondary relative overflow-hidden">
            <div className="absolute inset-0 bg-coptic-pattern opacity-20 pointer-events-none" />
            <span className="material-symbols-outlined text-[28px] relative z-10 text-secondary">
              {role === 'student' ? 'qr_code_2' : 'qr_code_scanner'}
            </span>
          </button>
        </Link>
      )}
    </>
  );
}
export default MobileNav;
