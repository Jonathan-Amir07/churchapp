'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, BadgeTag, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';

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
    <PageTransition className="space-y-6">
      <HeroBanner
        title={tNav('quizzes')}
        subtitle={tQuizzes('description')}
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            quiz
          </span>
        }
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localQuizzes.map((quiz) => {
          const locale = useLocale();
          const isAr = locale === 'ar';
          const title = isAr ? quiz.titleAr : quiz.titleEn;
          const description = isAr ? quiz.descriptionAr : quiz.descriptionEn;

          return (
            <StaggerItem key={quiz.id}>
              <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between h-full">
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
                      <span className="text-secondary flex items-center gap-1 glow-gold">
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        +{quiz.points} pts
                      </span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0 mt-auto">
                  <Button variant="primary" fullWidth size="sm" onClick={() => handleStartQuiz(quiz)}>
                    {tQuizzes(quiz.status === 'passed' ? 'retry' : 'startQuiz')}
                  </Button>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

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

                  <div className="space-y-2">
                    {activeQuiz.questions[currentQuestionIndex].optionsEn.map((opt: string, idx: number) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                      const optText =
                        tCommon('appName') !== 'JoyfulPath'
                          ? activeQuiz.questions[currentQuestionIndex].optionsAr[idx]
                          : opt;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold'
                              : 'border-outline-variant hover:border-primary/50 text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          {optText}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-outline-variant/40">
                  <Button
                    variant="primary"
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    onClick={handleNext}
                  >
                    {currentQuestionIndex < activeQuiz.questions.length - 1
                      ? tQuizzes('next')
                      : tQuizzes('finish')}
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Result
              <div className="text-center space-y-6 py-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container-highest">
                  <span
                    className={`material-symbols-outlined text-[64px] ${
                      quizResult.passed ? 'text-success' : 'text-error'
                    }`}
                  >
                    {quizResult.passed ? 'workspace_premium' : 'cancel'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-on-surface">
                    {quizResult.passed ? tQuizzes('passed') : tQuizzes('failed')}
                  </h3>
                  <p className="text-on-surface-variant font-medium">
                    {tQuizzes('score')}: {quizResult.score}%
                  </p>
                </div>

                {quizResult.passed && (
                  <div className="flex justify-center gap-4 animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
                    <div className="bg-primary/10 px-4 py-2 rounded-xl flex flex-col items-center">
                      <span className="material-symbols-outlined text-primary text-[24px]">insights</span>
                      <span className="font-bold text-primary">+{quizResult.xp} XP</span>
                    </div>
                    <div className="bg-secondary/10 px-4 py-2 rounded-xl flex flex-col items-center">
                      <span className="material-symbols-outlined text-secondary text-[24px]">stars</span>
                      <span className="font-bold text-secondary">+{quizResult.points} {tGamification('points')}</span>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <Button variant="primary" fullWidth onClick={handleClosePlayer}>
                    {tCommon('close')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </PageTransition>
  );
}
