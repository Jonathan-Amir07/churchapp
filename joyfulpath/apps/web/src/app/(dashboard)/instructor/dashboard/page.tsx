'use client';

import { useUser } from '@/hooks/useUser';
import { PageTransition } from '@/components/ui';
import Link from 'next/link';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';

export default function InstructorDashboard() {
  const { profile } = useUser();
  const { data: stats, isLoading } = useSWR('/instructors/dashboard', (url) => apiClient.get(url));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">لوحة تحكم المعلم</h1>
        <p className="font-body-md text-on-surface-variant mt-2 text-lg">مرحباً بك {profile?.display_name || ''}، إليك نظرة عامة على مهامك اليومية والأنشطة.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (Main Focus) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Today's Lessons Timeline */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                الدروس اليوم
              </h2>
            </div>
            <div className="relative ps-4 border-e-2 border-surface-variant z-10 space-y-6 ms-4">
              <div className="text-center text-on-surface-variant p-4">
                قريباً: جدول الدروس المباشر
              </div>
            </div>
          </section>
          
          {/* Assigned Classes List */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
              <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">class</span>
                الفصول المعينة ({stats?.classes?.length || 0})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-end">
                <thead className="bg-surface-container-low text-xs font-bold tracking-widest uppercase text-on-surface-variant">
                  <tr>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">المستوى</th>
                    <th className="py-3 px-4">عدد الطلاب</th>
                    <th className="py-3 px-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-base text-on-background divide-y divide-outline-variant">
                  {stats?.classes?.length === 0 ? (
                     <tr>
                       <td colSpan={4} className="py-4 text-center text-on-surface-variant">لا توجد فصول معينة بعد</td>
                     </tr>
                  ) : (
                    stats?.classes?.map((c: any) => (
                      <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                        <td className="py-4 px-4 font-bold">{c.name}</td>
                        <td className="py-4 px-4 text-on-surface-variant">{c.gradeLevel || '-'}</td>
                        <td className="py-4 px-4">{c._count?.members || 0}</td>
                        <td className="py-4 px-4 text-center">
                          <Link href={`/instructor/classes/${c.id}`} className="text-primary hover:text-primary-container">
                            <span className="material-symbols-outlined">visibility</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        {/* Right Column (Widgets & Feeds) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Pending Grading Widget */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-card relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-on-background mb-1">تقييمات معلقة</h2>
                <p className="text-base text-on-surface-variant">تحتاج إلى مراجعة</p>
              </div>
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-2xl font-bold">assignment_late</span>
              </div>
            </div>
            <div className="text-5xl font-extrabold text-primary mb-4">{stats?.pendingGrading || 0}</div>
            <div className="flex gap-2">
              <Link href="/instructor/tasks" className="flex-1 bg-primary text-center text-on-primary text-xs font-bold tracking-widest uppercase py-2 rounded hover:bg-primary-container transition-colors">
                ابدأ التقييم
              </Link>
              <Link href="/instructor/tasks" className="text-center flex-1 border border-outline text-on-surface text-xs font-bold tracking-widest uppercase py-2 rounded hover:bg-surface-variant transition-colors">
                عرض الكل
              </Link>
            </div>
          </section>
          
          {/* Attendance Overview Quick-link */}
          <Link href="/instructor/attendance" className="group bg-surface-container-low rounded-xl p-6 border border-outline-variant hover:border-primary transition-colors flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-on-background group-hover:text-primary transition-colors">نظرة عامة على الحضور</h3>
              <p className="text-base text-on-surface-variant mt-1">سجل حضور اليوم لـ {stats?.totalStudents || 0} طالب</p>
            </div>
            <div className="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center border border-outline-variant group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary rtl:-scale-x-100">arrow_forward</span>
            </div>
          </Link>
          
          {/* Recent Student Activity Feed */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant">
            <h2 className="text-xl font-bold text-on-background mb-4">نشاط الطلاب الأخير</h2>
            <div className="space-y-4">
              {stats?.recentActivity?.length === 0 ? (
                <p className="text-center text-on-surface-variant">لا توجد أنشطة حديثة</p>
              ) : (
                stats?.recentActivity?.map((activity: any) => (
                  <div key={activity.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-sm">notifications</span>
                    </div>
                    <div>
                      <p className="text-base text-on-background">
                        <span className="font-bold">{activity.user?.displayName}</span> {activity.action}
                      </p>
                      <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-1">
                        {new Date(activity.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
