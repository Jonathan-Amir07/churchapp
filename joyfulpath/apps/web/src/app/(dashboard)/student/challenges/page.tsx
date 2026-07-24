'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, ProgressBar, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function StudentChallenges() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { challenges, claimChallengeReward } = useAppStore();
  const addToast = useNotificationStore(s => s.addToast);

  const handleClaim = (id: string, title: string) => {
    claimChallengeReward(id);
    addToast(`Congratulations! You have claimed your rewards for completing the "${title}" challenge!`, 'success');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('challenges')}
        </h1>
        <p className="text-on-surface-variant text-sm">
          Complete daily, weekly, and seasonal objectives to earn bonus XP and redeemable points!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Challenges */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              today
            </span>
            Daily Objectives
          </h2>
          
          <div className="space-y-4">
            {challenges.filter((c) => c.type === 'daily').map((c) => {
              const progressPct = Math.min(100, Math.max(0, (c.current / c.target) * 100));
              return (
                <Card key={c.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-extrabold text-on-surface leading-tight">
                        {c.title}
                      </CardTitle>
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                        {c.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                        <span>Progress</span>
                        <span>{c.current} / {c.target}</span>
                      </div>
                      <ProgressBar value={progressPct} size="md" />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
                      <div className="flex flex-col text-[10px] font-bold text-secondary">
                        <span>+{c.xpReward} XP</span>
                        <span>+{c.pointsReward} Points</span>
                      </div>
                      
                      {c.claimed ? (
                        <span className="text-xs text-success font-extrabold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Claimed
                        </span>
                      ) : c.isCompleted ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleClaim(c.id, c.title)}
                          className="h-8 px-4 text-xs font-bold"
                        >
                          Claim Reward
                        </Button>
                      ) : (
                        <span className="text-xs text-outline font-bold">In Progress</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Weekly Challenges */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              date_range
            </span>
            Weekly Objectives
          </h2>

          <div className="space-y-4">
            {challenges.filter((c) => c.type === 'weekly').map((c) => {
              const progressPct = Math.min(100, Math.max(0, (c.current / c.target) * 100));
              return (
                <Card key={c.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-extrabold text-on-surface leading-tight">
                        {c.title}
                      </CardTitle>
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                        {c.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                        <span>Progress</span>
                        <span>{c.current} / {c.target}</span>
                      </div>
                      <ProgressBar value={progressPct} size="md" />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
                      <div className="flex flex-col text-[10px] font-bold text-secondary">
                        <span>+{c.xpReward} XP</span>
                        <span>+{c.pointsReward} Points</span>
                      </div>
                      
                      {c.claimed ? (
                        <span className="text-xs text-success font-extrabold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Claimed
                        </span>
                      ) : c.isCompleted ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleClaim(c.id, c.title)}
                          className="h-8 px-4 text-xs font-bold"
                        >
                          Claim Reward
                        </Button>
                      ) : (
                        <span className="text-xs text-outline font-bold">In Progress</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Seasonal Challenges */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            Seasonal Objectives
          </h2>

          <div className="space-y-4">
            {challenges.filter((c) => c.type === 'seasonal').map((c) => {
              const progressPct = Math.min(100, Math.max(0, (c.current / c.target) * 100));
              return (
                <Card key={c.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-extrabold text-on-surface leading-tight">
                        {c.title}
                      </CardTitle>
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                        {c.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                        <span>Progress</span>
                        <span>{c.current} / {c.target}</span>
                      </div>
                      <ProgressBar value={progressPct} size="md" />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
                      <div className="flex flex-col text-[10px] font-bold text-secondary">
                        <span>+{c.xpReward} XP</span>
                        <span>+{c.pointsReward} Points</span>
                      </div>
                      
                      {c.claimed ? (
                        <span className="text-xs text-success font-extrabold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Claimed
                        </span>
                      ) : c.isCompleted ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleClaim(c.id, c.title)}
                          className="h-8 px-4 text-xs font-bold"
                        >
                          Claim Reward
                        </Button>
                      ) : (
                        <span className="text-xs text-outline font-bold">In Progress</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
