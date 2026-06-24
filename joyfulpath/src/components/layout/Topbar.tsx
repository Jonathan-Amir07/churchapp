'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Button, Avatar, BadgeTag } from '@/components/ui';
import { formatXP, formatPoints } from '@/lib/utils';

export function Topbar() {
  const { data: session } = useSession();
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tGamification = useTranslations('gamification');
  const currentLocale = useLocale();

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const user = session?.user;
  const isStudent = user?.role === 'student';

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
      {/* Page Brand (Visible on mobile header) */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_stories
          </span>
        </div>
        <span className="text-md font-black tracking-tight text-primary">
          {tCommon('appName')}
        </span>
      </div>

      {/* Gamification summary (for students, LTR/RTL spacing is automatic) */}
      <div className="hidden md:flex items-center gap-4">
        {isStudent && (
          <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 py-1.5 px-4 rounded-full">
            {/* XP */}
            <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
              <span>{formatXP(user.totalXp)} {tCommon('appName') !== 'JoyfulPath' ? 'XP' : 'XP'}</span>
            </div>
            
            <div className="w-[1px] h-4 bg-outline-variant/60" />

            {/* Points */}
            <div className="flex items-center gap-1.5 text-sm font-bold text-secondary">
              <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span>{user.totalPoints.toLocaleString()} {tGamification('points')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action actions: Lang Toggle + User Avatar Menu */}
      <div className="flex items-center gap-4">
        {/* Language Toggler */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="h-9 px-3 rounded-full text-xs font-bold bg-surface-container-low/50 hover:bg-surface-container border border-outline-variant/50"
          icon="language"
          iconPosition="start"
        >
          {currentLocale === 'en' ? 'العربية' : 'English'}
        </Button>

        {/* User profile dropdown and signout */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-end leading-tight">
              <span className="text-sm font-extrabold text-on-surface">{user.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80">
                {user.role}
              </span>
            </div>
            
            <Avatar
              name={user.name || ''}
              src={user.avatarUrl || undefined}
              size="md"
              className="border border-outline-variant"
            />

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-surface-container rounded-full text-outline hover:text-error transition-all duration-150"
              title={tAuth('logout')}
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
export default Topbar;
