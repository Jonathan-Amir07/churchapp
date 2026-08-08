'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Button } from '@/components/ui';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function ParentDashboard() {
  const { profile } = useUser();
  const currentLocale = useLocale();
  const supabase = createClient();
  
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChildren() {
      if (!profile?.id) return;
      
      // Get linked children profiles via parent_children table
      const { data: links } = await supabase
        .from('parent_children')
        .select('student_id')
        .eq('parent_id', profile.id);

      if (links && links.length > 0) {
        const studentIds = links.map((l: { student_id: string }) => l.student_id);
        const { data: childrenProfiles } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', studentIds);

        if (childrenProfiles) {
          setChildren(childrenProfiles);
        }
      } else {
        // Fallback demo student if none are linked for rapid testing
        setChildren([
          {
            id: 'demo-student-1',
            display_name: 'Jonathan Junior',
            total_xp: 1250,
            total_points: 120,
            current_streak: 5,
            avatar_url: null,
            role: 'student'
          }
        ]);
      }
      setLoading(false);
    }
    
    if (profile) {
      loadChildren();
    }
  }, [profile]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-2xl select-none border border-secondary/30">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-secondary">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {currentLocale === 'en' ? `Parent Portal — Welcome ${profile?.display_name || ''}!` : `بوابة أولياء الأمور — أهلاً بك يا ${profile?.display_name || ''}!`}
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            {currentLocale === 'en' 
              ? 'Monitor your children’s Sunday school attendance, lesson completion progress, and memorization challenges.'
              : 'تابع حضور أطفالك لمدارس الأحد، ومدى تقدمهم في الدروس وتحديات حفظ الآيات.'}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-black text-on-surface">
        {currentLocale === 'en' ? 'My Children' : 'أطفالي'}
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="animate-pulse h-48 bg-surface-container" />
          <Card className="animate-pulse h-48 bg-surface-container" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => {
            const levelNum = Math.floor(child.total_xp / 300) + 1;
            return (
              <Card key={child.id} variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                      {child.display_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-on-surface">{child.display_name}</h3>
                      <p className="text-xs text-on-surface-variant font-bold">
                        Level {levelNum} ({child.total_xp} XP)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                    <div>
                      <p className="text-[10px] uppercase font-black text-outline">Streak</p>
                      <h4 className="text-sm font-black text-orange-600">{child.current_streak} Days</h4>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-outline">Points</p>
                      <h4 className="text-sm font-black text-yellow-600">{child.total_points} Pts</h4>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-outline">Attendance</p>
                      <h4 className="text-sm font-black text-tertiary">92%</h4>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Link href={`/parent/attendance?child=${child.id}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        {currentLocale === 'en' ? 'Attendance' : 'حضور'}
                      </Button>
                    </Link>
                    <Link href={`/parent/grades?child=${child.id}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        {currentLocale === 'en' ? 'Grades' : 'درجات'}
                      </Button>
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/parent/rewards?child=${child.id}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        {currentLocale === 'en' ? 'Rewards' : 'مكافآت'}
                      </Button>
                    </Link>
                    <Link href={`/parent/reading?child=${child.id}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        {currentLocale === 'en' ? 'Reading' : 'قراءة'}
                      </Button>
                    </Link>
                  </div>
                  <Link href={`/parent/reports?child=${child.id}`} className="w-full mt-2">
                    <Button variant="primary" size="sm" fullWidth>
                      {currentLocale === 'en' ? 'Full Report' : 'التقرير الشامل'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
