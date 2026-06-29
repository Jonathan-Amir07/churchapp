'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useUser } from '@/hooks/useUser';

export default function InstructorDashboard() {
  const { profile } = useUser();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const user = profile;

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-tactile select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Welcome back, Servant {user?.display_name || 'Servant'}!
          </h1>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            Manage your assigned classes, register attendance, evaluate task submissions, and publish new Bible lessons.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                Assigned Classes
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">1</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-blue-500">school</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                Total Students
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-green-500">groups</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="border border-outline-variant shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                Pending Tasks
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-red-500">pending_actions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classroom management actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-primary">event_available</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Track Attendance</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Record attendance for today&apos;s Sunday School class and update streaks.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/instructor/attendance">
              <Button variant="primary" fullWidth size="md">
                Record Attendance
              </Button>
            </Link>
          </div>
        </Card>

        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-tertiary">menu_book</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Upload Lessons</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Write lesson details, add attachments, and assign rewards.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/instructor/lessons">
              <Button variant="success" fullWidth size="md">
                Manage Lessons
              </Button>
            </Link>
          </div>
        </Card>

        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-orange-600">task_alt</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Review Submissions</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                View student homework, grade submissions, and award bonus points.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/instructor/tasks">
              <Button variant="secondary" fullWidth size="md">
                Review Tasks
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
