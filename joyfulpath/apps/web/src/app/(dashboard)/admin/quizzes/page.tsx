'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input, SearchBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { useAppStore } from '@/stores/app.store';

export default function InstructorQuizzes() {
  const tNav = useTranslations('nav');
  const tQuizzes = useTranslations('quizzes');
  const tCommon = useTranslations('common');
  const tLessons = useTranslations('lessons');
  const tGamification = useTranslations('gamification');
  const addToast = useNotificationStore(s => s.addToast);
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [classes, setClasses] = useState<{id: string, nameEn: string, nameAr: string}[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [xp, setXp] = useState(50);
  const [points, setPoints] = useState(10);
  const [classId, setClassId] = useState('');

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch('/api/quizzes');
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
    async function loadClasses() {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
          if (data.length > 0) setClassId(data[0].id);
        }
      } catch (e) {}
    }
    loadClasses();
  }, [fetchQuizzes]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredQuizzes = useMemo(() => {
    if (!searchQuery) return quizzes;
    const q = searchQuery.toLowerCase();
    return quizzes.filter(
      (quiz) =>
        quiz.titleEn.toLowerCase().includes(q) ||
        quiz.titleAr.toLowerCase().includes(q)
    );
  }, [quizzes, searchQuery]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr || !classId) {
      addToast(tLessons('fillAllFields'), 'error');
      return;
    }

    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn,
          titleAr,
          passingScore,
          xp,
          points,
          classId
        })
      });

      if (res.ok) {
        addToast(tQuizzes('publishSuccess'), 'success');
        setIsOpen(false);
        fetchQuizzes();
        
        // Reset Form
        setTitleEn('');
        setTitleAr('');
        setPassingScore(70);
        setXp(50);
        setPoints(10);
      } else {
        addToast('Failed to create quiz', 'error');
      }
    } catch (error) {
      addToast('Error occurred', 'error');
    }
  }, [titleEn, titleAr, passingScore, xp, points, classId, addToast, tLessons, tQuizzes, fetchQuizzes]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('quizzes')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tQuizzes('instructorDescription')}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add" iconPosition="start">
          {tQuizzes('createQuizBtn')}
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder={tCommon('search')}
        resultCount={filteredQuizzes.length}
        totalCount={quizzes.length}
      />

      {/* List of quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => {
          const title = isAr ? quiz.titleAr : quiz.titleEn;

          return (
            <Card key={quiz.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold text-outline">
                    {tQuizzes('passingPercent', { score: quiz.passingScore })}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-primary text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      +{quiz.xp} XP
                    </span>
                    <span className="text-secondary text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      +{quiz.points} {tGamification('points')}
                    </span>
                  </div>
                </div>

                <CardTitle className="text-lg font-black text-on-surface leading-tight">
                  {title}
                </CardTitle>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                    {tCommon('edit')}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-3 text-xs text-error hover:bg-error/5 hover:text-error border-outline-variant/60">
                    {tCommon('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredQuizzes.length === 0 && (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">quiz</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tQuizzes('noQuizzes')}</p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tQuizzes('createQuizBtn')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{isAr ? 'الفصل' : 'Class'}</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-low text-sm font-medium focus:outline-none focus:border-primary"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tQuizzes('titleEn')}</label>
                <Input required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Genesis Quiz" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tQuizzes('titleAr')}</label>
                <Input required value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: اختبار التكوين" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tQuizzes('passingScoreLabel')}</label>
                <Input type="number" min={50} max={100} required value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tQuizzes('xpReward')}</label>
                <Input type="number" min={10} max={500} required value={xp} onChange={(e) => setXp(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tQuizzes('pointsReward')}</label>
                <Input type="number" min={5} max={100} required value={points} onChange={(e) => setPoints(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tQuizzes('createAddQuestions')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

