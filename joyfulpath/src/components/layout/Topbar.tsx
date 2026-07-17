'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button, Avatar, ThemeToggle } from '@/components/ui';
import { formatXP } from '@/lib/utils';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { NotificationBell } from '@/components/ui/NotificationBell';

function timeAgo(dateStr: string, isAr: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return isAr ? 'الآن' : 'Just now';
  if (mins < 60) return isAr ? `منذ ${mins} دقيقة` : `${mins}m ago`;
  if (hours < 24) return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
  return isAr ? `منذ ${days} يوم` : `${days}d ago`;
}

export function Topbar() {
  const { profile } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tGamification = useTranslations('gamification');
  const currentLocale = useLocale();
  const { xp, points } = useAppStore();

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const user = profile;
  const isStudent = user?.role === 'student';
  
  const dynamicXP = isStudent ? xp : (user?.total_xp || 0);
  const dynamicPoints = isStudent ? points : (user?.total_points || 0);

  // Role translation mapping
  const roleTranslations: Record<string, string> = {
    'student': 'مخدوم',
    'instructor': 'خادم',
    'admin': 'مسؤول الخدمة',
    'parent': 'ولي أمر'
  };
  
  const displayRole = user?.role ? (currentLocale === 'ar' ? roleTranslations[user.role] : user.role) : '';

  return (
    <div className="flex flex-col relative z-20">
      <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 md:px-8 sticky top-0 shadow-sm relative overflow-hidden">
        {/* Subtle Coptic Background Pattern */}
        <div className="absolute inset-0 bg-coptic-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Header content needs relative z-index to sit above pattern */}
        <div className="flex items-center justify-between w-full relative z-10">
          {/* Page Brand (Visible on mobile header) */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-secondary/30">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              <span>{formatXP(dynamicXP)} XP</span>
            </div>
            
            <div className="w-[1px] h-4 bg-outline-variant/60" />

            {/* Points */}
            <div className="flex items-center gap-1.5 text-sm font-bold text-secondary">
              <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span>{dynamicPoints.toLocaleString()} {tGamification('points')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action actions: Notifications + Lang Toggle + User Avatar Menu */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Toggler */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="h-9 px-2 sm:px-3 rounded-full text-xs font-bold bg-surface-container-low/50 hover:bg-surface-container border border-outline-variant/50"
          icon="language"
          iconPosition="start"
        >
          <span className="hidden sm:inline">{currentLocale === 'en' ? 'العربية' : 'English'}</span>
          <span className="sm:hidden uppercase">{currentLocale === 'en' ? 'ar' : 'en'}</span>
        </Button>

        {/* User profile dropdown and signout */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col items-end text-end leading-tight">
              <span className="text-sm font-extrabold text-on-surface">{user.display_name}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80">
                {displayRole}
              </span>
            </div>
            
            <Avatar
              name={user.display_name || ''}
              src={user.avatar_url || undefined}
              size="md"
              className="border border-outline-variant"
            />

            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex p-2 hover:bg-surface-container rounded-full text-outline hover:text-error transition-all duration-150"
              title={tAuth('logout')}
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
        </div>
      </header>
      
      {/* Mobile Verse Ticker (visible only on mobile) */}
      <div className="md:hidden bg-secondary/10 border-b border-secondary/20 py-1.5 px-4 overflow-hidden whitespace-nowrap text-[10px] font-bold text-secondary-container">
        <div className="inline-block animate-[shimmer_15s_linear_infinite] w-full text-center">
          <span className="material-symbols-outlined text-[10px] align-middle mr-1">auto_awesome</span>
          آية اليوم: "فَرَحًا أَفْرَحُ بِالرَّبِّ، تَبْتَهِجُ نَفْسِي بِإِلهِي..." (إشعياء 61: 10)
        </div>
      </div>
    </div>
  );
}
export default Topbar;
