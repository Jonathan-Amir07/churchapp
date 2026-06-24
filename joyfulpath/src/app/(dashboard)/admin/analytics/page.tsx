'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardHeader, ProgressBar } from '@/components/ui';

export default function AdminAnalytics() {
  const tNav = useTranslations('nav');
  const tAnalytics = useTranslations('analytics');
  const tCommon = useTranslations('common');

  // Renders beautiful, premium custom bar charts
  const weeklyActiveUsers = [
    { label: 'Mon', value: 8 },
    { label: 'Tue', value: 12 },
    { label: 'Wed', value: 20 },
    { label: 'Thu', value: 15 },
    { label: 'Fri', value: 25 },
    { label: 'Sat', value: 34 },
    { label: 'Sun', value: 40 },
  ];

  const classPerformance = [
    { name: 'Class A (Primary)', value: 85 },
    { name: 'Class B (Junior)', value: 65 },
    { name: 'Class C (Senior)', value: 92 },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('analytics')}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {tAnalytics('description')}
        </p>
      </div>

      {/* Numerical Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
              {tAnalytics('attendanceAverage')}
            </p>
            <h3 className="text-3xl font-extrabold text-on-surface">88.5%</h3>
          </div>
          <div className="mt-4">
            <ProgressBar value={88.5} className="h-2" />
          </div>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
              {tAnalytics('completionRate')}
            </p>
            <h3 className="text-3xl font-extrabold text-on-surface">74.2%</h3>
          </div>
          <div className="mt-4">
            <ProgressBar value={74.2} className="h-2 bg-surface-container-high" />
          </div>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">
              Total Points Redeemed
            </p>
            <h3 className="text-3xl font-extrabold text-on-surface">1,450 pts</h3>
          </div>
          <div className="mt-4">
            <ProgressBar value={62} className="h-2 bg-surface-container-high" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Weekly Active Users Chart */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{tAnalytics('activeUsers')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-outline-variant/60">
              {weeklyActiveUsers.map((day) => {
                const heightPct = (day.value / 40) * 100;
                return (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    {/* Bar tag */}
                    <span className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {day.value}
                    </span>
                    {/* Bar block */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-primary/20 group-hover:bg-primary rounded-t-lg transition-all duration-200"
                    />
                    {/* Label */}
                    <span className="text-[10px] font-bold text-on-surface-variant select-none mt-1">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Class Performance Chart */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">Class Submission Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {classPerformance.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span>{c.name}</span>
                  <span>{c.value}% completed</span>
                </div>
                <ProgressBar value={c.value} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
