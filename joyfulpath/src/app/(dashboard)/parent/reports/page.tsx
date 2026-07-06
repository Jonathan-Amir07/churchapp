'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Button } from '@/components/ui';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function ParentReports() {
  const searchParams = useSearchParams();
  const childId = searchParams.get('child');
  const currentLocale = useLocale();
  const supabase = createClient();

  const [childProfile, setChildProfile] = useState<any>(null);
  const [lessonsProgress, setLessonsProgress] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportData() {
      if (!childId) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', childId)
        .single();
      
      if (profile) setChildProfile(profile);

      // Get lesson progress
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('*, lessons(title)')
        .eq('user_id', childId);
      if (progress) setLessonsProgress(progress);

      // Get quiz attempts
      const { data: quizzes } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title)')
        .eq('student_id', childId);
      if (quizzes) setQuizAttempts(quizzes);

      // Falls back to mock data if empty
      if (!progress || progress.length === 0) {
        setLessonsProgress([
          { id: '1', progress_pct: 100, lessons: { title: 'Genesis - The Creation story' } },
          { id: '2', progress_pct: 60, lessons: { title: 'Noah - Ark and covenant' } },
          { id: '3', progress_pct: 0, lessons: { title: 'Abraham - Father of many nations' } }
        ]);
      }
      if (!quizzes || quizzes.length === 0) {
        setQuizAttempts([
          { id: '1', score: 90, total_possible: 100, percentage: 90.0, passed: true, completed_at: '2026-06-25', quizzes: { title: 'Creation Review Quiz' } },
          { id: '2', score: 50, total_possible: 100, percentage: 50.0, passed: false, completed_at: '2026-06-20', quizzes: { title: 'Covenants Challenge' } }
        ]);
      }
      
      setLoading(false);
    }

    loadReportData();
  }, [childId]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center gap-4">
        <Link href="/parent/dashboard">
          <Button variant="ghost" size="sm" className="rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Performance Report' : 'تقرير الأداء'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {currentLocale === 'en'
              ? `Academic and spiritual metrics for ${childProfile?.display_name || ''}`
              : `النتائج الأكاديمية والروحية للطالب ${childProfile?.display_name || ''}`}
          </p>
        </div>
      </div>

      {loading ? (
        <Card className="animate-pulse h-64 bg-surface-container" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lesson Progress */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black text-on-surface">
                {currentLocale === 'en' ? 'Lesson Completion' : 'التقدم في الدروس'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lessonsProgress.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                    <span>{p.lessons?.title || 'Bible Study'}</span>
                    <span>{p.progress_pct}%</span>
                  </div>
                  <ProgressBar value={p.progress_pct} size="md" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiz Attempts */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black text-on-surface">
                {currentLocale === 'en' ? 'Quiz Scores' : 'درجات الاختبارات'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant/40">
                {quizAttempts.map((attempt) => (
                  <div key={attempt.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{attempt.quizzes?.title || 'Quiz'}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {currentLocale === 'en' ? 'Date:' : 'التاريخ:'} {attempt.completed_at?.split('T')[0] || ''}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className={`text-sm font-black ${attempt.passed ? 'text-tertiary' : 'text-error'}`}>
                        {attempt.score}/{attempt.total_possible} ({attempt.percentage}%)
                      </span>
                      <p className="text-[10px] uppercase font-black tracking-wider text-outline">
                        {attempt.passed ? (currentLocale === 'en' ? 'Passed' : 'ناجح') : (currentLocale === 'en' ? 'Failed' : 'راسب')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
