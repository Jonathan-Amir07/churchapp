'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, ProgressBar, BadgeTag } from '@/components/ui';

export default function ParentGamificationPage() {
  const tCommon = useTranslations('common');

  // Mock children data
  const childrenData = [
    { name: 'Jonathan', xp: 1250, level: 3, nextLevelXp: 1500, points: 450, rewardsPending: 1, streak: 5 },
    { name: 'Sarah', xp: 850, level: 2, nextLevelXp: 1000, points: 210, rewardsPending: 0, streak: 2 },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">Children Progress & Rewards</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track XP, points, and pending physical rewards for your children.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {childrenData.map((child, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-on-surface">{child.name}</h3>
                    <p className="text-xs text-on-surface-variant font-bold">Level {child.level} Explorer</p>
                  </div>
                </div>
                {child.rewardsPending > 0 && (
                  <BadgeTag label={`${child.rewardsPending} Reward Pending`} color="warning" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low text-center">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">XP Points</p>
                  <p className="text-xl font-extrabold text-primary">{child.xp}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low text-center">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">Redeemable Points</p>
                  <p className="text-xl font-extrabold text-tertiary">{child.points}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant">Level Progress</span>
                  <span className="text-on-surface-variant">{child.xp} / {child.nextLevelXp} XP</span>
                </div>
                <ProgressBar value={(child.xp / child.nextLevelXp) * 100} size="md" />
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-orange-500">local_fire_department</span>
                  {child.streak} Day Login Streak
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
