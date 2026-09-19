'use client';

import { PageTransition } from '@/components/ui';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import Link from 'next/link';

export default function InstructorLessonsPage() {
  const { data: stats, isLoading } = useSWR('/instructors/dashboard', (url) => apiClient.get(url));

  return (
    <PageTransition className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">دروس مدارس الأحد</h1>
          <p className="font-body-md text-on-surface-variant mt-2 text-lg">اختر فصلاً لإدارة دروسه.</p>
        </div>
        <Link 
          href="/instructor/lessons/new" 
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-container transition-colors"
        >
          إنشاء درس
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.classes?.length > 0 ? (
            stats.classes?.map((c: any) => (
              <Link 
                key={c.id} 
                href={`/instructor/classes/${c.id}`} 
                className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary hover:shadow-md transition-all group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-on-background mb-2">{c.name}</h3>
                <div className="flex justify-between text-sm text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/50">
                  <span className="flex items-center gap-1 text-primary font-bold">عرض الدروس <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-surface rounded-xl border border-outline-variant p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">menu_book</span>
              <p>لا توجد فصول مخصصة لك حالياً.</p>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
}
