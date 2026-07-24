'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface Quiz {
  id: string;
  titleEn: string;
  titleAr: string;
  passingScore: number;
  xp: number;
  points: number;
}

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: '1',
    titleEn: 'The Story of Creation Quiz',
    titleAr: 'اختبار قصة الخلق',
    passingScore: 70,
    xp: 50,
    points: 10,
  },
  {
    id: '2',
    titleEn: "Noah's Ark & Rainbow Covenant",
    titleAr: 'فلك نوح وعهد قوس قزح',
    passingScore: 70,
    xp: 50,
    points: 10,
  },
];

export default function InstructorQuizzes() {
  const tNav = useTranslations('nav');
  const tQuizzes = useTranslations('quizzes');
  const tCommon = useTranslations('common');
  const tLessons = useTranslations('lessons');
  const tGamification = useTranslations('gamification');
  const addToast = useNotificationStore(s => s.addToast);

  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [xp, setXp] = useState(50);
  const [points, setPoints] = useState(10);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr) {
      addToast(tLessons('fillAllFields'), 'error');
      return;
    }

    const newQuiz: Quiz = {
      id: String(quizzes.length + 1),
      titleEn,
      titleAr,
      passingScore,
      xp,
      points,
    };

    setQuizzes((prev) => [newQuiz, ...prev]);
    setIsOpen(false);
    addToast(tQuizzes('publishSuccess'), 'success');

    // Reset Form
    setTitleEn('');
    setTitleAr('');
    setPassingScore(70);
    setXp(50);
    setPoints(10);
  };

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

      {/* List of quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
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

        {quizzes.length === 0 && (
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
