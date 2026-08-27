'use client';

import { useUser } from '@/hooks/useUser';
import { PageTransition } from '@/components/ui';
import Link from 'next/link';

export default function AdminDashboard() {
  const { profile } = useUser();

  return (
    <PageTransition className="space-y-8 pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">
            المركز الإداري
          </h1>
          <p className="text-on-surface-variant text-lg">
            مرحباً بك في لوحة تحكم JoyfulPath
          </p>
        </div>
        {/* Quick Filters & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pr-10 pl-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              placeholder="بحث..." 
              type="text"
            />
          </div>
          <button aria-label="Filter" className="p-2 bg-surface-container border border-outline-variant rounded-full text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Summary Cards (KPI Widgets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-bold tracking-widest uppercase">إجمالي الطلاب</span>
            <span className="material-symbols-outlined text-tertiary-container">group</span>
          </div>
          <div className="text-2xl font-bold text-primary">1,248</div>
          <div className="flex items-center gap-1 text-tertiary-container text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12% هذا الشهر</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-bold tracking-widest uppercase">الصفوف النشطة</span>
            <span className="material-symbols-outlined text-primary-container">class</span>
          </div>
          <div className="text-2xl font-bold text-primary">42</div>
          <div className="flex items-center gap-1 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-sm">horizontal_rule</span>
            <span>مستقر</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-bold tracking-widest uppercase">المهام المعلقة</span>
            <span className="material-symbols-outlined text-secondary-container">pending_actions</span>
          </div>
          <div className="text-2xl font-bold text-primary">15</div>
          <div className="flex items-center gap-1 text-error text-sm">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            <span>5 عاجل</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-bold tracking-widest uppercase">تسجيلات الدخول الأخيرة</span>
            <span className="material-symbols-outlined text-tertiary">login</span>
          </div>
          <div className="text-2xl font-bold text-primary">312</div>
          <div className="flex items-center gap-1 text-tertiary-container text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>اليوم</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Growth Analytics */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] p-6 flex flex-col">
          <h3 className="text-xl font-bold text-on-surface mb-6">تحليلات نمو الطلاب</h3>
          <div className="relative w-full h-64 mt-auto rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant flex items-end px-4 pt-8 pb-4">
            <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-outline-variant pr-2 py-4 items-end">
              <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
            </div>
            <div className="absolute inset-0 right-12 flex flex-col justify-between py-4 pointer-events-none">
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
            </div>
            <div className="relative flex-grow flex justify-around items-end h-full z-10 mr-12">
              <div className="w-12 bg-primary-container/30 hover:bg-primary-container rounded-t-md h-[40%] transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
              </div>
              <div className="w-12 bg-primary-container/50 hover:bg-primary-container rounded-t-md h-[60%] transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">60%</div>
              </div>
              <div className="w-12 bg-primary-container/70 hover:bg-primary-container rounded-t-md h-[85%] transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">85%</div>
              </div>
              <div className="w-12 bg-primary rounded-t-md h-[75%] transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">75%</div>
              </div>
              <div className="w-12 bg-primary-container hover:bg-primary rounded-t-md h-[95%] transition-colors relative group cursor-pointer shadow-[0_6px_0px_rgba(0,22,78,0.2)]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">95%</div>
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center w-full pr-12 mt-2 text-xs text-outline-variant">
            <span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-surface rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] p-6">
          <h3 className="text-xl font-bold text-on-surface mb-6">الجدول الزمني للنشاط</h3>
          <div className="relative border-r-2 border-surface-variant pr-6 flex flex-col gap-6">
            <div className="relative">
              <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-tertiary border-2 border-surface"></div>
              <p className="text-xs text-outline-variant uppercase tracking-widest font-bold mb-1">منذ 10 دقائق</p>
              <p className="text-on-surface text-sm font-bold">أكمل صموئيل اختبار &quot;تاريخ الكنيسة&quot;</p>
              <p className="text-xs text-on-surface-variant mt-1">حصل على 95% - مستوى متقدم.</p>
            </div>
            <div className="relative">
              <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-surface"></div>
              <p className="text-xs text-outline-variant uppercase tracking-widest font-bold mb-1">منذ ساعتين</p>
              <p className="text-on-surface text-sm font-bold">تمت إضافة درس جديد: &quot;أسرار الكنيسة السبعة&quot;</p>
              <p className="text-xs text-on-surface-variant mt-1">بواسطة الأب يوحنا.</p>
            </div>
            <div className="relative">
              <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-secondary-container border-2 border-surface"></div>
              <p className="text-xs text-outline-variant uppercase tracking-widest font-bold mb-1">أمس</p>
              <p className="text-on-surface text-sm font-bold">انضم 5 طلاب جدد إلى صف الأحد</p>
              <p className="text-xs text-on-surface-variant mt-1">تم إرسال رسائل الترحيب التلقائية.</p>
            </div>
            <div className="relative">
              <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-error border-2 border-surface"></div>
              <p className="text-xs text-outline-variant uppercase tracking-widest font-bold mb-1">22 مايو 2024</p>
              <p className="text-on-surface text-sm font-bold">تنبيه نظام: النسخ الاحتياطي تأخر</p>
              <p className="text-xs text-on-surface-variant mt-1">يرجى مراجعة إعدادات الخادم.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(33,79,199,0.04)] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-xl font-bold text-on-surface">أحدث التسجيلات</h3>
          <button className="text-primary text-xs font-bold tracking-widest uppercase hover:underline">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                <th className="p-4 py-3">الطالب</th>
                <th className="p-4 py-3">الصف</th>
                <th className="p-4 py-3">تاريخ الانضمام</th>
                <th className="p-4 py-3">الحالة</th>
                <th className="p-4 py-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-surface-variant">
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">M</div>
                  <span>ماريا مجدي</span>
                </td>
                <td className="p-4">الصف الثالث</td>
                <td className="p-4 text-on-surface-variant">24 مايو 2024</td>
                <td className="p-4"><span className="px-2 py-1 bg-tertiary-container/20 text-tertiary rounded-full text-xs font-bold">نشط</span></td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">M</div>
                  <span>مينا عادل</span>
                </td>
                <td className="p-4">الشباب المتقدم</td>
                <td className="p-4 text-on-surface-variant">23 مايو 2024</td>
                <td className="p-4"><span className="px-2 py-1 bg-tertiary-container/20 text-tertiary rounded-full text-xs font-bold">نشط</span></td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">ك</div>
                  <span>كيرلس هاني</span>
                </td>
                <td className="p-4">الابتدائية أ</td>
                <td className="p-4 text-on-surface-variant">20 مايو 2024</td>
                <td className="p-4"><span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs font-bold">قيد الانتظار</span></td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
