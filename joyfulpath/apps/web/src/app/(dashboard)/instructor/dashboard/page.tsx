'use client';

import { useUser } from '@/hooks/useUser';
import { PageTransition } from '@/components/ui';
import Link from 'next/link';

export default function InstructorDashboard() {
  const { profile } = useUser();

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
          <section className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                الدروس اليوم
              </h2>
            </div>
            <div className="relative pl-4 border-r-2 border-surface-variant z-10 space-y-6 ml-4">
              {/* Lesson 1 */}
              <div className="relative pr-6">
                <div className="absolute -right-[7px] top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-surface"></div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-on-background">مقدمة في العقيدة</h3>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-2 py-1 rounded">09:00 ص</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant">الصف الأول الإعدادي • القاعة 3</p>
                </div>
              </div>
              {/* Lesson 2 */}
              <div className="relative pr-6">
                <div className="absolute -right-[7px] top-1 w-3 h-3 bg-surface-variant rounded-full ring-4 ring-surface"></div>
                <div className="bg-surface p-4 rounded-lg border border-outline-variant">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-on-background">تاريخ الكنيسة</h3>
                    <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant bg-surface-variant px-2 py-1 rounded">11:30 ص</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant">الصف الثالث الإعدادي • القاعة 1</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Assigned Classes List */}
          <section className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
              <h2 className="text-2xl font-bold text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">class</span>
                الفصول المعينة
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-surface-container-low text-xs font-bold tracking-widest uppercase text-on-surface-variant">
                  <tr>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">المستوى</th>
                    <th className="py-3 px-4">عدد الطلاب</th>
                    <th className="py-3 px-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-base text-on-background divide-y divide-outline-variant">
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-4 font-bold">مجموعة القديس مرقس</td>
                    <td className="py-4 px-4 text-on-surface-variant">مبتدئ</td>
                    <td className="py-4 px-4">24</td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-primary hover:text-primary-container">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-4 font-bold">مجموعة القديس جورج</td>
                    <td className="py-4 px-4 text-on-surface-variant">متوسط</td>
                    <td className="py-4 px-4">18</td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-primary hover:text-primary-container">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        {/* Right Column (Widgets & Feeds) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Pending Grading Widget */}
          <section className="bg-surface rounded-xl p-6 border border-outline-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-on-background mb-1">تقييمات معلقة</h2>
                <p className="text-base text-on-surface-variant">تحتاج إلى مراجعة</p>
              </div>
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-2xl font-bold">assignment_late</span>
              </div>
            </div>
            <div className="text-5xl font-extrabold text-primary mb-4">12</div>
            <div className="flex gap-2">
              <Link href="/instructor/tasks" className="flex-1 bg-primary text-center text-on-primary text-xs font-bold tracking-widest uppercase py-2 rounded hover:bg-primary-container transition-colors">
                ابدأ التقييم
              </Link>
              <button className="flex-1 border border-outline text-on-surface text-xs font-bold tracking-widest uppercase py-2 rounded hover:bg-surface-variant transition-colors">
                عرض الكل
              </button>
            </div>
          </section>
          
          {/* Attendance Overview Quick-link */}
          <Link href="/instructor/attendance" className="group bg-surface-container-low rounded-xl p-6 border border-outline-variant hover:border-primary transition-colors flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-on-background group-hover:text-primary transition-colors">نظرة عامة على الحضور</h3>
              <p className="text-base text-on-surface-variant mt-1">سجل حضور اليوم</p>
            </div>
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-outline-variant group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary rtl:-scale-x-100">arrow_forward</span>
            </div>
          </Link>
          
          {/* Recent Student Activity Feed */}
          <section className="bg-surface rounded-xl p-6 border border-outline-variant">
            <h2 className="text-xl font-bold text-on-background mb-4">نشاط الطلاب الأخير</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
                <div>
                  <p className="text-base text-on-background"><span className="font-bold">مينا يوسف</span> أكمل مهمة &quot;حفظ المزمور&quot;</p>
                  <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-1">منذ 10 دقائق</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-sm">forum</span>
                </div>
                <div>
                  <p className="text-base text-on-background"><span className="font-bold">مريم بطرس</span> طرحت سؤالاً في مجتمع الفصل</p>
                  <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-1">منذ 45 دقيقة</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
