'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';

export default function StudentDashboard() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');


  const { xp, points, level, streak, challenges, activities } = useAppStore();

  // Level computation logic helper
  const currentXP = xp;
  const currentLevelNum = level;
  
  // Custom titles for levels based on currentLevelNum
  const levelTitles: Record<number, string> = {
    1: 'Seedling',
    2: 'Little Lamb',
    3: 'Bright Light',
    4: 'Bible Buddy',
    5: 'Story Keeper',
    6: 'Verse Master',
    7: 'Faith Seeker',
    8: 'Prayer Hero',
    9: 'Wisdom Scout',
    10: 'Young Explorer',
  };
  const currentLevelTitle = levelTitles[currentLevelNum] || 'Faith Explorer';

  // XP bounds
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

  // Active Daily Challenge for preview
  const activeDaily = challenges.find((c) => c.type === 'daily' && !c.claimed);

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
                {streak} {t('days')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center animate-[pulse-soft_2s_infinite]">
              <span className="material-symbols-outlined text-[28px] text-orange-500 dark:text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                {points} {tGamification('points')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-950/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-yellow-600 dark:text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>
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
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-blue-500 dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
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
          <ProgressBar value={progressPct} size="lg" />
          <div className="flex justify-between text-xs font-bold text-on-surface-variant/80">
            <span>Level {currentLevelNum}</span>
            <span>Level {currentLevelNum + 1}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lesson panel */}
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary">menu_book</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">Explore Lessons</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Read biblical histories and complete weekly quiz chapters.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/lessons">
              <Button variant="primary" fullWidth size="sm">
                Open Lessons
              </Button>
            </Link>
          </div>
        </Card>

        {/* Timed Quizzes Panel */}
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-tertiary">quiz</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">Bible Quizzes</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Test your speed and memory with timed question runs.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/quizzes">
              <Button variant="success" fullWidth size="sm">
                Start Quizzes
              </Button>
            </Link>
          </div>
        </Card>

        {/* Learning Hub & Games */}
        <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <span className="material-symbols-outlined text-[24px]">sports_esports</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">Games & Tracker</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Play Verse Builder or Saints Match, track reading logs.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/games">
              <Button variant="outline" fullWidth size="sm" className="border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20">
                Go to Games
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Challenge Card (Left 1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              explore
            </span>
            Active Challenge
          </h2>
          
          {activeDaily ? (
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-on-surface">{activeDaily.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">{activeDaily.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                    <span>Progress</span>
                    <span>{activeDaily.current} / {activeDaily.target}</span>
                  </div>
                  <ProgressBar value={(activeDaily.current / activeDaily.target) * 100} size="sm" />
                </div>
                
                <Link href="/student/challenges" className="block pt-2">
                  <Button variant="outline" fullWidth size="sm" className="text-xs h-9">
                    View All Challenges
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-5 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-success">check_circle</span>
                <h3 className="text-sm font-extrabold text-on-surface">Daily Complete!</h3>
                <p className="text-xs text-on-surface-variant">You have finished all daily objectives.</p>
                <Link href="/student/challenges" className="block pt-2">
                  <Button variant="outline" fullWidth size="sm" className="text-xs h-9">
                    View Weekly/Seasonal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Feed (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            {t('recentActivity')}
          </h2>

          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant/60">
                {activities.slice(0, 4).map((activity) => {
                  const isAr = tCommon('appName') !== 'JoyfulPath';
                  const detail = isAr ? activity.detailAr : activity.detail;
                  
                  // Icon picking
                  let icon = 'insights';
                  let iconColor = 'text-primary bg-primary/10';
                  if (activity.action === 'task_completed') {
                    icon = 'task_alt';
                    iconColor = 'text-success bg-success/10';
                  } else if (activity.action === 'badge_unlocked') {
                    icon = 'military_tech';
                    iconColor = 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20';
                  } else if (activity.action === 'level_gained') {
                    icon = 'award_star';
                    iconColor = 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20';
                  }

                  return (
                    <div key={activity.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                          <span className="material-symbols-outlined text-[18px]">{icon}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface">{detail}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">By {activity.studentName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-outline font-bold">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
