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
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const isAr = tCommon('appName') !== 'JoyfulPath';
  const unread = unreadCount();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      router.push(link);
      setShowNotifications(false);
    }
  };

  const user = profile;
  const isStudent = user?.role === 'student';
  
  const dynamicXP = isStudent ? xp : (user?.total_xp || 0);
  const dynamicPoints = isStudent ? points : (user?.total_points || 0);

  const NOTIF_TYPE_COLORS: Record<string, string> = {
    badge: 'text-yellow-600 bg-yellow-50',
    lesson: 'text-blue-500 bg-blue-50',
    challenge: 'text-orange-500 bg-orange-50',
    reward: 'text-green-500 bg-green-50',
    announcement: 'text-purple-500 bg-purple-50',
    prayer: 'text-pink-500 bg-pink-50',
    event: 'text-teal-500 bg-teal-50',
  };

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
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-surface-container rounded-full transition-all duration-150"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant" style={{ fontVariationSettings: showNotifications ? "'FILL' 1" : undefined }}>
              notifications
            </span>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-black rounded-full px-1 animate-[bounce-in_0.3s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute top-full mt-2 end-0 w-[calc(100vw-32px)] sm:w-[360px] max-h-[480px] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevated overflow-hidden z-50 animate-[scale-in_0.2s_ease-out]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/60">
                <h3 className="text-sm font-black text-on-surface">
                  {isAr ? 'الإشعارات' : 'Notifications'}
                </h3>
                {unread > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-[380px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-[40px] text-outline">notifications_off</span>
                    <p className="text-xs font-bold text-on-surface-variant mt-2">
                      {isAr ? 'لا توجد إشعارات' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notif) => {
                    const typeColor = NOTIF_TYPE_COLORS[notif.type] || 'text-on-surface-variant bg-surface-container';
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id, notif.link)}
                        className={`w-full text-start px-4 py-3 flex items-start gap-3 hover:bg-surface-container transition-colors duration-150 border-b border-outline-variant/30 ${
                          !notif.isRead ? 'bg-primary/[0.03]' : ''
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeColor}`}>
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {notif.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-bold leading-tight truncate ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                              {isAr ? notif.titleAr : notif.titleEn}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                            {isAr ? notif.messageAr : notif.messageEn}
                          </p>
                          <p className="text-[10px] font-bold text-outline">
                            {timeAgo(notif.createdAt, isAr)}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
                {user.role}
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
  );
}
export default Topbar;
