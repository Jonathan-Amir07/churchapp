'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Avatar, BadgeTag } from '@/components/ui';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl?: string;
  totalXp: number;
  totalPoints: number;
  level: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

const MOCK_WEEKLY: LeaderboardUser[] = [
  { rank: 1, name: 'Jonathan Amir', totalXp: 450, totalPoints: 90, level: 3, badgesCount: 4 },
  { rank: 2, name: 'Mary Faith', totalXp: 380, totalPoints: 75, level: 2, badgesCount: 3, isCurrentUser: true },
  { rank: 3, name: 'David Shepherd', totalXp: 350, totalPoints: 70, level: 2, badgesCount: 2 },
  { rank: 4, name: 'Noah Ark', totalXp: 300, totalPoints: 60, level: 2, badgesCount: 2 },
  { rank: 5, name: 'Sarah Joy', totalXp: 280, totalPoints: 55, level: 1, badgesCount: 1 },
];

const MOCK_MONTHLY: LeaderboardUser[] = [
  { rank: 1, name: 'Jonathan Amir', totalXp: 1850, totalPoints: 370, level: 5, badgesCount: 6 },
  { rank: 2, name: 'Noah Ark', totalXp: 1600, totalPoints: 320, level: 4, badgesCount: 5 },
  { rank: 3, name: 'David Shepherd', totalXp: 1450, totalPoints: 290, level: 4, badgesCount: 4 },
  { rank: 4, name: 'Mary Faith', totalXp: 1320, totalPoints: 260, level: 3, badgesCount: 4, isCurrentUser: true },
  { rank: 5, name: 'Sarah Joy', totalXp: 980, totalPoints: 195, level: 3, badgesCount: 3 },
];

const MOCK_ALLTIME: LeaderboardUser[] = [
  { rank: 1, name: 'Jonathan Amir', totalXp: 5400, totalPoints: 1080, level: 8, badgesCount: 12 },
  { rank: 2, name: 'David Shepherd', totalXp: 4800, totalPoints: 960, level: 7, badgesCount: 10 },
  { rank: 3, name: 'Noah Ark', totalXp: 4500, totalPoints: 900, level: 7, badgesCount: 9 },
  { rank: 4, name: 'Mary Faith', totalXp: 4100, totalPoints: 820, level: 6, badgesCount: 8, isCurrentUser: true },
  { rank: 5, name: 'Sarah Joy', totalXp: 3200, totalPoints: 640, level: 5, badgesCount: 6 },
];

export default function StudentLeaderboard() {
  const tNav = useTranslations('nav');
  const tLeaderboard = useTranslations('leaderboard');
  const tCommon = useTranslations('common');

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const getRankList = () => {
    if (activeTab === 'weekly') return MOCK_WEEKLY;
    if (activeTab === 'monthly') return MOCK_MONTHLY;
    return MOCK_ALLTIME;
  };

  const list = getRankList();
  const podium = list.filter((user) => user.rank <= 3);
  const others = list.filter((user) => user.rank > 3);

  // Sorting podium to display: 2nd, 1st, 3rd visually
  const visualPodium = [
    podium.find((u) => u.rank === 2),
    podium.find((u) => u.rank === 1),
    podium.find((u) => u.rank === 3),
  ].filter(Boolean) as LeaderboardUser[];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('leaderboard')}
          </h1>
          <BadgeTag variant="primary">
            {tLeaderboard('activeStudents', { count: 12 })}
          </BadgeTag>
        </div>
        <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
          {tLeaderboard('celebrating')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/60 shadow-sm max-w-md mx-auto">
        {(['weekly', 'monthly', 'allTime'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-150 ${
              activeTab === tab
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tLeaderboard(tab)}
          </button>
        ))}
      </div>

      {/* Podium Display */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto items-end pt-8 pb-4">
        {visualPodium.map((user) => {
          const isFirst = user.rank === 1;
          const isSecond = user.rank === 2;
          const isThird = user.rank === 3;

          return (
            <div
              key={user.rank}
              className={`flex flex-col items-center text-center space-y-2 select-none ${
                isFirst ? 'order-2 z-10' : isSecond ? 'order-1' : 'order-3'
              }`}
            >
              {/* Avatar circle */}
              <div className="relative">
                <div
                  className={`rounded-full p-1.5 shadow-md ${
                    isFirst
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 scale-110'
                      : isSecond
                      ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                      : 'bg-gradient-to-br from-orange-400 to-amber-600'
                  }`}
                >
                  <Avatar name={user.name} size={isFirst ? 'lg' : 'md'} className="border border-white/20" />
                </div>
                {/* Crown/Trophy Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isFirst ? 'text-yellow-500 animate-bounce' : 'text-outline'
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isFirst ? 'workspace_premium' : 'military_tech'}
                  </span>
                </div>
              </div>

              {/* Name & XP */}
              <div className="space-y-0.5">
                <p className="text-xs font-black text-on-surface truncate max-w-[80px]">
                  {user.name}
                </p>
                <p className="text-[10px] font-black text-primary">
                  {user.totalXp} XP
                </p>
              </div>

              {/* Pedestal block */}
              <div
                className={`w-full rounded-t-xl flex flex-col items-center justify-center p-3 font-black text-white ${
                  isFirst
                    ? 'h-24 bg-gradient-to-b from-yellow-500 to-amber-600 shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                    : isSecond
                    ? 'h-20 bg-gradient-to-b from-slate-400 to-slate-500'
                    : 'h-16 bg-gradient-to-b from-orange-500 to-amber-700'
                }`}
              >
                <span className="text-xl">{user.rank}</span>
                <span className="text-[10px] uppercase opacity-85">
                  Lvl {user.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ranks Table Card */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                  <th className="px-6 py-4 text-start w-16">#</th>
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Explorer' : 'المستكشف'}</th>
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Level' : 'المستوى'}</th>
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Badges' : 'الشارات'}</th>
                  <th className="px-6 py-4 text-end">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {others.map((user) => (
                  <tr
                    key={user.rank}
                    className={`transition duration-150 ${
                      user.isCurrentUser ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="px-6 py-4 font-black text-on-surface-variant">
                      {user.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-extrabold text-on-surface flex items-center gap-1.5">
                          {user.name}
                          {user.isCurrentUser && (
                            <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface-variant">
                      Lvl {user.level}
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface-variant">
                      {user.badgesCount}
                    </td>
                    <td className="px-6 py-4 text-end font-extrabold text-primary">
                      {user.totalXp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
