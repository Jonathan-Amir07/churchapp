'use client';

import useSWR from 'swr';
import { useUser } from '@/hooks/useUser';
import { apiClient } from '@/lib/apiClient';
import { PageTransition } from '@/components/ui';

export default function StudentAnalyticsPage() {
  const { profile } = useUser();
  const { data: analytics, isLoading } = useSWR(
    profile?.id ? `/analytics/student/${profile.id}` : null,
    (url) => apiClient.get(url)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-on-surface-variant mb-4">تعذر تحميل الإحصائيات.</p>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">الإحصائيات والتقدم</h1>
        <p className="font-body-md text-on-surface-variant mt-2 text-lg">تتبع تقدمك وإنجازاتك في مدارس الأحد.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">stars</span>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">إجمالي النقاط</h3>
          <p className="text-3xl font-extrabold text-on-background mt-1">{analytics.overview.totalPoints}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">military_tech</span>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">الخبرة (XP)</h3>
          <p className="text-3xl font-extrabold text-on-background mt-1">{analytics.overview.totalXp}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-tertiary mb-2">local_fire_department</span>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">الاستمرارية الحالية</h3>
          <p className="text-3xl font-extrabold text-on-background mt-1">{analytics.overview.currentStreak} أيام</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">emoji_events</span>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">المستوى الحالي</h3>
          <p className="text-xl font-extrabold text-on-background mt-1">{analytics.overview.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <section className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
            <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">event_available</span>
              الحضور
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-on-surface font-bold">نسبة الحضور</span>
              <span className="text-primary font-bold">{analytics.attendance.rate}%</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-4 overflow-hidden mb-6">
              <div 
                className="bg-primary h-4 rounded-full transition-all duration-1000" 
                style={{ width: `${analytics.attendance.rate}%` }}
              ></div>
            </div>
            
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{analytics.attendance.present}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">حضور</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{analytics.attendance.absent}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">غياب</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
            <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">school</span>
              التعلم والأداء
            </h2>
          </div>
          <div className="p-6 flex flex-col justify-around h-full gap-4">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg">
              <span className="font-bold text-on-surface">المهام المنجزة</span>
              <span className="text-xl font-black text-primary">{analytics.learning.tasksCompleted}</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg">
              <span className="font-bold text-on-surface">متوسط درجات الاختبارات</span>
              <span className="text-xl font-black text-secondary">{analytics.learning.quizAvgScore}%</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg">
              <span className="font-bold text-on-surface">الإنجازات المكتسبة</span>
              <span className="text-xl font-black text-tertiary">{analytics.learning.achievementsCount}</span>
            </div>
          </div>
        </section>
      </div>

    </PageTransition>
  );
}
