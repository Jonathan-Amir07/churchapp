'use client';

import { useUser } from '@/hooks/useUser';
import { PageTransition } from '@/components/ui';

export default function PriestDashboard() {
  const { profile } = useUser();

  return (
    <PageTransition className="space-y-8 animate-[slide-up_0.4s_ease-out] pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row justify-between md:items-end pb-4 border-b border-outline-variant/30 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-on-background font-display-lg-mobile md:font-display-lg">رؤى تنفيذية</h2>
          <p className="text-lg text-on-surface-variant mt-1">نظرة عامة على الأداء - أبرشية القديس مرقس - أبونا {profile?.display_name || ''}</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors bg-surface">
            <span className="material-symbols-outlined">download</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-widest uppercase hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined icon-fill text-sm">calendar_month</span>
            تحديد الفترة
          </button>
        </div>
      </header>

      {/* KPI Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">نمو الكنيسة (عضوية)</h3>
            <span className="material-symbols-outlined text-outline">trending_up</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-primary">١٢,٤٥٠</span>
            <span className="text-xs font-bold tracking-widest uppercase text-tertiary flex items-center mb-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              ٤.٢٪
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">حضور الطلاب (أسبوعي)</h3>
            <span className="material-symbols-outlined text-outline">school</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-primary">٨,٢١٠</span>
            <span className="text-xs font-bold tracking-widest uppercase text-tertiary flex items-center mb-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              ١.٨٪
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-tertiary w-4/5 rounded-full"></div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">أداء الخدام (متوسط)</h3>
            <span className="material-symbols-outlined text-outline">group</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-primary">٩٤٪</span>
            <span className="text-xs font-bold tracking-widest uppercase text-error flex items-center mb-1">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              ٠.٥٪
            </span>
          </div>
        </div>
      </section>

      {/* Dashboard Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Area (Spans 8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-outline-variant p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-on-background">مؤشرات الحضور السنوية</h3>
            <button className="p-1 rounded text-on-surface-variant hover:bg-surface-variant">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <div className="flex-1 min-h-[300px] w-full relative rounded-lg border border-outline-variant/30 bg-background/50 overflow-hidden flex items-end px-4 pt-8 pb-4 gap-2">
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="w-full h-px bg-outline"></div>
              <div className="w-full h-px bg-outline"></div>
              <div className="w-full h-px bg-outline"></div>
              <div className="w-full h-px bg-outline"></div>
            </div>
            
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary/20 hover:bg-primary transition-colors h-[40%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">يناير</span></div></div>
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary/40 hover:bg-primary transition-colors h-[55%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">فبراير</span></div></div>
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary/60 hover:bg-primary transition-colors h-[80%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">مارس</span></div></div>
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary/80 hover:bg-primary transition-colors h-[65%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">أبريل</span></div></div>
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary hover:bg-primary transition-colors h-[90%] rounded-t-sm shadow-[0_0_15px_rgba(33,79,199,0.3)] relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity text-primary">مايو</span></div></div>
            <div className="flex-1 flex items-end justify-center group"><div className="w-3/4 bg-primary/30 hover:bg-primary transition-colors h-[45%] rounded-t-sm relative"></div></div>
          </div>
        </div>

        {/* Events Calendar (Spans 4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-xl border border-outline-variant p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-on-background">الفعاليات القادمة</h3>
            <a className="text-xs font-bold tracking-widest uppercase text-primary hover:underline" href="#">عرض الكل</a>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-4 items-start group">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/50">
                <span className="text-xs font-bold tracking-widest uppercase leading-none">١٥</span>
                <span className="text-[10px] font-bold tracking-widest uppercase leading-none mt-1">مايو</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-on-surface">اجتماع الكهنة الشهري</h4>
                <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> ١٠:٠٠ صباحاً
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/50">
                <span className="text-xs font-bold tracking-widest uppercase leading-none">١٨</span>
                <span className="text-[10px] font-bold tracking-widest uppercase leading-none mt-1">مايو</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-on-surface">مؤتمر الشباب السنوي</h4>
                <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> كنيسة العذراء
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/50">
                <span className="text-xs font-bold tracking-widest uppercase leading-none">٢٢</span>
                <span className="text-[10px] font-bold tracking-widest uppercase leading-none mt-1">مايو</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-on-surface">دورة تدريب الخدام</h4>
                <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">laptop_mac</span> عبر الإنترنت
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Log / Timeline */}
      <section className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest">
          <h3 className="text-xl font-bold text-on-background">سجل النشاط الحديث</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-6 text-xs font-bold tracking-widest uppercase text-on-surface-variant font-medium">الوقت</th>
                <th className="py-3 px-6 text-xs font-bold tracking-widest uppercase text-on-surface-variant font-medium">النشاط</th>
                <th className="py-3 px-6 text-xs font-bold tracking-widest uppercase text-on-surface-variant font-medium">المستخدم</th>
                <th className="py-3 px-6 text-xs font-bold tracking-widest uppercase text-on-surface-variant font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="py-4 px-6 text-base text-on-surface-variant whitespace-nowrap">منذ ١٠ دقائق</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">edit_document</span>
                    </div>
                    <span className="text-base text-on-background">تحديث منهج المرحلة الإعدادية</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-base text-on-surface whitespace-nowrap">أبونا أنطونيوس</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-tertiary-container text-on-tertiary-container">مكتمل</span>
                </td>
              </tr>
              
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="py-4 px-6 text-base text-on-surface-variant whitespace-nowrap">منذ ساعتين</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                    </div>
                    <span className="text-base text-on-background">تسجيل ٤٥ طالب جديد</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-base text-on-surface whitespace-nowrap">سكرتارية الكنيسة</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-tertiary-container text-on-tertiary-container">مكتمل</span>
                </td>
              </tr>
              
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="py-4 px-6 text-base text-on-surface-variant whitespace-nowrap">أمس</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-error-container text-on-error-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">warning</span>
                    </div>
                    <span className="text-base text-on-background">فشل مزامنة بيانات الحضور</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-base text-on-surface whitespace-nowrap">النظام الآلي</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-error text-on-error">خطأ</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </PageTransition>
  );
}
