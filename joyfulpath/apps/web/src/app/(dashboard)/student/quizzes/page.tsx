'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, BadgeTag } from '@/components/ui';

import { useAppStore } from '@/stores/app.store';

export default function StudentQuizzes() {
  const tNav = useTranslations('nav');
  const tQuizzes = useTranslations('quizzes');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');
  const { quizzes, addXP, addPoints } = useAppStore();

  const [localQuizzes, setLocalQuizzes] = useState(quizzes);
  
  useEffect(() => {
    setLocalQuizzes(quizzes);
  }, [quizzes]);
  
  // Quiz Player State
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    xp: number;
    points: number;
  } | null>(null);

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      activeQuiz.questions.forEach((q: any, idx: number) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
      const isPassed = scorePct >= activeQuiz.passingScore;

      const xpEarned = isPassed ? activeQuiz.xp : 0;
      const pointsEarned = isPassed ? activeQuiz.points : 0;

      // Update quiz list status
      setLocalQuizzes((prev) =>
        prev.map((q) =>
          q.id === activeQuiz.id
            ? { ...q, status: isPassed ? 'passed' : 'failed' }
            : q
        )
      );

      if (isPassed) {
        addXP(xpEarned);
        addPoints(pointsEarned);
      }

      setQuizResult({
        score: scorePct,
        passed: isPassed,
        xp: xpEarned,
        points: pointsEarned,
      });
    }
  };

  const handleClosePlayer = () => {
    setActiveQuiz(null);
    setQuizResult(null);
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('quizzes')}
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
          {tQuizzes('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localQuizzes.map((quiz) => {
          const locale = useLocale();
  const isAr = locale === 'ar';
          const title = isAr ? quiz.titleAr : quiz.titleEn;
          const description = isAr ? quiz.descriptionAr : quiz.descriptionEn;

          return (
            <Card key={quiz.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <BadgeTag
                    variant={
                      quiz.status === 'passed'
                        ? 'success'
                        : quiz.status === 'failed'
                        ? 'error'
                        : 'outline'
                    }
                  >
                    {tQuizzes(
                      quiz.status === 'passed'
                        ? 'passed'
                        : quiz.status === 'failed'
                        ? 'failed'
                        : 'startQuiz'
                    )}
                  </BadgeTag>
                  <span className="text-xs font-bold text-outline">
                    {tQuizzes('questionsCount', { count: quiz.questions.length })}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-on-surface leading-tight">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {description}
                  </CardDescription>
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-outline-variant/40">
                  <span className="text-on-surface-variant">
                    {tQuizzes('passingScore', { score: quiz.passingScore })}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      +{quiz.xp} XP
                    </span>
                    <span className="text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      +{quiz.points} pts
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button variant="primary" fullWidth size="sm" onClick={() => handleStartQuiz(quiz)}>
                  {tQuizzes(quiz.status === 'passed' ? 'retry' : 'startQuiz')}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quiz Player Dialog */}
      {activeQuiz && (
        <Modal
          isOpen={true}
          onClose={handleClosePlayer}
          title={
            quizResult
              ? tQuizzes('quizResult')
              : `${tCommon('appName') !== 'JoyfulPath' ? activeQuiz.titleAr : activeQuiz.titleEn}`
          }
        >
          <div className="space-y-6 pt-2">
            {!quizResult ? (
              // Quiz Question
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-bold text-outline">
                  <span>
                    {tQuizzes('question')} {currentQuestionIndex + 1} / {activeQuiz.questions.length}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-on-surface leading-snug">
                    {tCommon('appName') !== 'JoyfulPath'
                      ? activeQuiz.questions[currentQuestionIndex].textAr
                      : activeQuiz.questions[currentQuestionIndex].textEn}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {(tCommon('appName') !== 'JoyfulPath'
                      ? activeQuiz.questions[currentQuestionIndex].optionsAr
                      : activeQuiz.questions[currentQuestionIndex].optionsEn
                    ).map((option: any, idx: number) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-start p-4 rounded-xl border font-bold text-sm transition-all duration-150 ${
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary shadow-[0_2px_8px_rgba(0,88,190,0.08)]'
                              : 'border-outline-variant hover:bg-surface-container bg-transparent text-on-surface'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                  <Button variant="outline" size="sm" onClick={handleClosePlayer}>
                    {tCommon('cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    onClick={handleNext}
                  >
                    {currentQuestionIndex < activeQuiz.questions.length - 1
                      ? tQuizzes('nextQuestion')
                      : tQuizzes('submitQuiz')}
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Results View
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-surface-container shadow-inner">
                  <span
                    className={`material-symbols-outlined text-[48px] ${
                      quizResult.passed ? 'text-tertiary' : 'text-error'
                    }`}
                  >
                    {quizResult.passed ? 'check_circle' : 'cancel'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-on-surface">
                    {tQuizzes(quizResult.passed ? 'passed' : 'failed')}
                  </h3>
                  <p className="text-sm font-bold text-on-surface-variant">
                    {tQuizzes('score')}: {quizResult.score}%
                  </p>
                </div>

                {quizResult.passed && (
                  <div className="flex items-center justify-center gap-4 py-3 bg-surface-container rounded-xl max-w-xs mx-auto border border-outline-variant/60">
                    <span className="text-xs font-black text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      {tQuizzes('xpEarned', { xp: quizResult.xp })}
                    </span>
                    <span className="text-xs font-black text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      {tQuizzes('pointsEarned', { points: quizResult.points })}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 justify-center pt-6 border-t border-outline-variant">
                  <Button variant="outline" size="sm" onClick={handleClosePlayer}>
                    {tQuizzes('backToQuizzes')}
                  </Button>
                  {!quizResult.passed && (
                    <Button variant="primary" size="sm" onClick={() => handleStartQuiz(activeQuiz)}>
                      {tQuizzes('retry')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

