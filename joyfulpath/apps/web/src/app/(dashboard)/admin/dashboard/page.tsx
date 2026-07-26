'use client';

import { useTranslations } from 'next-intl';
import { useUser } from '@/hooks/useUser';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { AttendanceOverview } from '@/components/admin/dashboard/AttendanceOverview';
import { BirthdaysList } from '@/components/admin/dashboard/BirthdaysList';
import { TasksTimeline } from '@/components/admin/dashboard/TasksTimeline';
import { PrayerRequestsWidget } from '@/components/admin/dashboard/PrayerRequestsWidget';
import { DataUploader } from '@/components/admin/dashboard/DataUploader';

export default function AdminDashboard() {
  const { profile } = useUser();
  const tAD = useTranslations('adminDashboard');

  const user = profile;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-surface-container-low border border-outline-variant/50 shadow-sm flex items-center justify-between">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-on-surface">
              {isAdmin ? 'إدارة النظام' : 'إدارة الفصول'} — أهلاً {user?.display_name || ''}
            </h1>
          </div>
          <p className="text-sm font-medium text-on-surface-variant max-w-xl">
            {isAdmin 
              ? 'مرحباً بك في لوحة تحكم النظام. يمكنك متابعة الأداء، الحضور، وإدارة البيانات بسرعة.'
              : 'مرحباً بك في لوحة تحكم الخدام. قم بمتابعة مخدوميك وتسجيل الحضور بسهولة.'}
          </p>
        </div>
        <div className="hidden md:flex opacity-10">
          <span className="material-symbols-outlined text-[100px]">church</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Right Column (Wider for main stats) */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendanceOverview />
            <QuickActions />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TasksTimeline />
            <PrayerRequestsWidget />
          </div>
        </div>

        {/* Left Column (Narrower for lists/uploads) */}
        <div className="md:col-span-4 space-y-6">
          <BirthdaysList />
          <DataUploader />
        </div>

      </div>
    </div>
  );
}
