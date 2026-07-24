'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useUser } from '@/hooks/useUser';

export default function AdminDashboard() {
  const { profile } = useUser();
  const tCommon = useTranslations('common');

  const user = profile;


  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-2xl select-none border border-secondary/30">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-secondary">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {user?.role === 'instructor' ? 'Class Administration' : 'Platform Administration'} — Welcome {user?.display_name || 'User'}!
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            {user?.role === 'instructor' 
              ? 'As a class admin, you can manage your assigned classes, students, tasks, attendance, and rewards.'
              : 'As a system administrator, you have full control over classes, user creation, CSV bulk imports, rewards configuration, and site-wide settings.'}
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="default" className="border-2 border-secondary/20 shadow-sm relative overflow-hidden bg-surface-container-lowest hover:border-secondary/50 hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-black text-on-surface-variant/80 tracking-wider">
                Total Accounts
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">1</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-primary">manage_accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border-2 border-secondary/20 shadow-sm relative overflow-hidden bg-surface-container-lowest hover:border-secondary/50 hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-black text-on-surface-variant/80 tracking-wider">
                Active Classes
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">1</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 border border-green-200/50 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-green-500">school</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border-2 border-secondary/20 shadow-sm relative overflow-hidden bg-surface-container-lowest hover:border-secondary/50 hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-black text-on-surface-variant/80 tracking-wider">
                System Badges
              </p>
              <h3 className="text-3xl font-extrabold text-secondary">6</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-secondary">military_tech</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin management actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user?.role !== 'instructor' && (
          <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px] text-primary">groups</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Manage Users</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                  Create new admin profiles or register bulk student accounts via CSV imports.
                </p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/admin/users">
                <Button variant="primary" fullWidth size="md">
                  Users List
                </Button>
              </Link>
            </div>
          </Card>
        )}

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-tertiary">domain</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Configure Classes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Establish new classes, assign servants, and set grade level parameters.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/admin/classes">
              <Button variant="success" fullWidth size="md">
                Classes Setup
              </Button>
            </Link>
          </div>
        </Card>

        {user?.role !== 'instructor' && (
          <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px] text-orange-600">settings_applications</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">System Settings</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                  Manage global configuration variables, points multipliers, and backup logs.
                </p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/admin/settings">
                <Button variant="secondary" fullWidth size="md">
                  Open Settings
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
