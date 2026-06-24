'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const tCommon = useTranslations('common');

  const user = session?.user;

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-tactile select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Platform Administration — Welcome {user?.name}!
          </h1>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            As a system administrator, you have full control over classes, user creation, CSV bulk imports, rewards configuration, and site-wide settings.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                Total Accounts
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">1</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-blue-500">manage_accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                Active Classes
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">1</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-green-500">school</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                System Badges
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">6</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-yellow-600">military_tech</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin management actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-primary">groups</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Manage Users</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Create new instructor profiles or register bulk student accounts via CSV imports.
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

        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-tertiary">domain</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Configure Classes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Establish new classes, assign instructors, and set grade level parameters.
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

        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
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
      </div>
    </div>
  );
}
