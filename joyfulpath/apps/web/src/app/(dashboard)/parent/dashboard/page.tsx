'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui';
import { useLocale } from 'next-intl';

export default function ParentDashboard() {
  const { profile } = useUser();
  const currentLocale = useLocale();
  const supabase = createClient();
  
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChildren() {
      try {
        const res = await fetch('/api/parent/children');
        if (res.ok) {
          const childrenProfiles = await res.json();
          if (childrenProfiles && childrenProfiles.length > 0) {
            setChildren(childrenProfiles);
          } else {
            setChildren([
              {
                id: 'demo-student-1',
                display_name: 'يوسف ميخائيل',
                total_xp: 2450,
                total_points: 120,
                current_streak: 5,
                avatar_url: null,
                role: 'student'
              }
            ]);
          }
        }
      } catch (e) {
        console.error('Failed to load children', e);
      }
      setLoading(false);
    }
    
    loadChildren();
  }, []);

  return (
    <div className="space-y-8 animate-[slide-up_0.4s_ease-out]">
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">تقدم الطفل</h1>
        <p className="text-lg text-on-surface-variant mt-2">بوابة الوالدين - تتبع نمو طفلك الروحي والتعليمي</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="animate-pulse h-48 bg-surface-container" />
          <Card className="animate-pulse h-48 bg-surface-container" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {children.map((child) => {
            const levelNum = Math.floor(child.total_xp / 300) + 1;
            const xpForNextLevel = levelNum * 300;
            const xpProgress = (child.total_xp % 300) / 300 * 100;
            const xpRemaining = xpForNextLevel - child.total_xp;

            return (
              <div key={child.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Child Overview Card (Span 8) */}
                <div className="lg:col-span-8 bg-surface rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden border border-outline-variant/30 shadow-[0px_4px_20px_rgba(33,79,199,0.04)]">
                  <div className="relative shrink-0">
                    {child.avatar_url ? (
                      <img alt="Child Portrait" src={child.avatar_url} className="w-32 h-32 rounded-full border-4 border-surface shadow-md object-cover z-10 relative" />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-surface shadow-md bg-primary/10 flex items-center justify-center font-bold text-4xl text-primary z-10 relative">
                        {child.display_name[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm z-20">
                      مستوى {levelNum}
                    </div>
                  </div>
                  
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface mb-1">{child.display_name}</h3>
                        <p className="text-base text-on-surface-variant">مستكشف الكتاب المقدس</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold text-primary">{child.total_xp}</span>
                        <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant ml-1">نقاط الخبرة (XP)</span>
                      </div>
                    </div>
                    {/* XP Bar */}
                    <div className="w-full h-6 bg-surface-variant rounded-full mt-4 relative overflow-hidden border-2 border-surface shadow-inner">
                      <div className="absolute top-0 right-0 h-full bg-[#FFD700] rounded-full transition-all duration-1000 ease-out" style={{ width: `${xpProgress}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full animate-[shimmer_3s_infinite_linear]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold tracking-widest uppercase text-outline">
                      <span>المستوى الحالي</span>
                      <span>{xpRemaining} نقطة للوصول للمستوى {levelNum + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Rings (Span 4) */}
                <div className="lg:col-span-4 bg-surface rounded-xl p-6 border border-outline-variant/30 flex flex-col justify-center shadow-[0px_4px_20px_rgba(33,79,199,0.04)]">
                  <h3 className="text-2xl font-bold text-on-surface mb-6 text-center">نظرة عامة على التقدم</h3>
                  <div className="flex justify-around items-center">
                    {/* Ring 1 */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-surface-variant stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                          <circle className="text-primary stroke-current transition-all duration-300" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.75)} strokeLinecap="round" strokeWidth="8" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold tracking-widest uppercase text-primary">75%</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-2">القراءة</span>
                    </div>
                    {/* Ring 2 */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-surface-variant stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                          <circle className="text-tertiary-container stroke-current transition-all duration-300" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.90)} strokeLinecap="round" strokeWidth="8" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold tracking-widest uppercase text-tertiary-container">90%</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-2">الدروس</span>
                    </div>
                    {/* Ring 3 */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-surface-variant stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                          <circle className="text-secondary-container stroke-current transition-all duration-300" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.60)} strokeLinecap="round" strokeWidth="8" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold tracking-widest uppercase text-secondary">60%</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mt-2">الاختبارات</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
