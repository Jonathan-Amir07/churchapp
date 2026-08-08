'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Button, PageTransition, HeroBanner, StatCard, StaggerContainer, StaggerItem } from '@/components/ui';
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
    <PageTransition className="space-y-6">
      {/* Welcome Banner */}
      <HeroBanner
        title={t('welcomeMessage', { xpNeeded, nextLevel: currentLevelNum + 1 })}
        subtitle="You are making fantastic progress! Complete today's lesson to earn more XP and unlock the next wisdom badge."
      >
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:block opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
          <img 
            src="/images/welcome-illustration.png" 
            alt="Children learning"
            className="w-full h-full object-cover object-left mask-image-fade"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
          />
        </div>
      </HeroBanner>

      {/* Stats Summary Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StaggerItem>
          <StatCard
            icon="local_fire_department"
            label={t('streak')}
            value={`${streak} ${t('days')}`}
            iconColor="text-orange-500 bg-orange-100 dark:text-orange-400 dark:bg-orange-950/30 glow-gold"
          />
        </StaggerItem>

        <StaggerItem>
          <StatCard
            icon="stars"
            label={t('totalPoints')}
            value={`${points} ${tGamification('points')}`}
            iconColor="text-secondary bg-secondary/10"
          />
        </StaggerItem>

        <StaggerItem>
          <StatCard
            icon="award_star"
            label={t('level')}
            value={currentLevelTitle}
            iconColor="text-primary bg-primary/10"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Gamification Level Progress Meter */}
      <Card variant="default" className="border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-coptic-pattern opacity-[0.02] pointer-events-none" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lesson panel */}
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
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

        {/* Tasks Panel */}
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-[24px]">task</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">My Tasks</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Complete assignments from your instructor.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/tasks">
              <Button variant="outline" fullWidth size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                View Tasks
              </Button>
            </Link>
          </div>
        </Card>

        {/* Reading Plan */}
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-[24px]">auto_stories</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">Reading Plan</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Track your daily Bible reading progress.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/reading">
              <Button variant="outline" fullWidth size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Open Plan
              </Button>
            </Link>
          </div>
        </Card>

        {/* Rewards Panel */}
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <span className="material-symbols-outlined text-[24px]">stars</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface">Rewards</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Redeem your points for badges and prizes.
              </p>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/student/rewards">
              <Button variant="outline" fullWidth size="sm" className="border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                View Rewards
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
                  const locale = useLocale();
  const isAr = locale === 'ar';
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
    </PageTransition>
  );
}

