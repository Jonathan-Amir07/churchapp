'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Button } from '@/components/ui';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');

  const user = session?.user;

  // Level computation logic helper for display if DB records are missing
  const currentXP = user?.totalXp || 0;
  const currentLevelNum = user?.currentLevel?.number || 1;
  const currentLevelTitle = user?.currentLevel?.title || 'Seedling';

  // XP bounds (mock calculation just for safe UI fallback display)
  const getLevelMaxXP = (lvl: number) => {
    const bounds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5200, 6800, 9000, 12000, 16000, 999999];
    return bounds[lvl] || 100;
  };
  const getLevelMinXP = (lvl: number) => {
    const bounds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5200, 6800, 9000, 12000, 16000, 999999];
    return bounds[lvl - 1] || 0;
  };

  const minXp = getLevelMinXP(currentLevelNum);
  const maxXp = getLevelMaxXP(currentLevelNum);
  const xpInLevel = currentXP - minXp;
  const levelRange = maxXp - minXp;
  const progressPct = levelRange > 0 ? Math.min(100, Math.max(0, (xpInLevel / levelRange) * 100)) : 100;
  const xpNeeded = Math.max(0, maxXp - currentXP);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-tactile select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-yellow-300 animate-[bounce-in_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {t('welcomeMessage', { xpNeeded, nextLevel: currentLevelNum + 1 })}
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            You are making fantastic progress! Complete today&apos;s lesson to earn more XP and unlock the next wisdom badge.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Streak Stat */}
        <Card variant="default" className="border border-outline-variant shadow-sm relative overflow-hidden bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                {t('streak')}
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">
                5 {t('days')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Points Stat */}
        <Card variant="default" className="border border-outline-variant shadow-sm relative overflow-hidden bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                {t('totalPoints')}
              </p>
              <h3 className="text-3xl font-extrabold text-on-surface">
                {user?.totalPoints || 0} {tGamification('points')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-yellow-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Level Info */}
        <Card variant="default" className="border border-outline-variant shadow-sm relative overflow-hidden bg-surface-container-lowest">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
                {t('level')}
              </p>
              <h3 className="text-2xl font-extrabold text-on-surface truncate max-w-[160px]">
                {currentLevelTitle}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                award_star
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Level Progress Meter */}
      <Card variant="default" className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-on-surface">
              {tGamification('levelUp')}
            </CardTitle>
            <span className="text-xs font-bold text-on-surface-variant">
              {currentXP} / {maxXp} XP
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          <ProgressBar value={progressPct} className="h-4 bg-surface-container-high" />
          <div className="flex justify-between text-xs font-bold text-on-surface-variant/80">
            <span>Level {currentLevelNum}</span>
            <span>Level {currentLevelNum + 1}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lesson panel */}
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-primary">menu_book</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-on-surface">Explore Bible Lessons</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Read fascinating stories, learn verses, and unlock exciting weekly quests.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/student/lessons">
              <Button variant="primary" fullWidth size="md">
                Open Lessons
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quizzes panel */}
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-tertiary">quiz</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-on-surface">Take Bible Quizzes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Put your knowledge to the test and earn bonus points for perfect scores!
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/student/quizzes">
              <Button variant="success" fullWidth size="md">
                Start Quizzes
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
