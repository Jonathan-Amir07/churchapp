'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardHeader, ProgressBar, BadgeTag } from '@/components/ui';

// ── Mock Data ──────────────────────────────────────────────────────
const ATTENDANCE_TREND = [
  { week: 'W1', value: 72 }, { week: 'W2', value: 78 }, { week: 'W3', value: 85 },
  { week: 'W4', value: 80 }, { week: 'W5', value: 88 }, { week: 'W6', value: 82 },
  { week: 'W7', value: 91 }, { week: 'W8', value: 95 },
];

const WEEKLY_ACTIVE = [
  { label: 'Mon', value: 8 }, { label: 'Tue', value: 12 }, { label: 'Wed', value: 20 },
  { label: 'Thu', value: 15 }, { label: 'Fri', value: 25 }, { label: 'Sat', value: 34 },
  { label: 'Sun', value: 40 },
];

const XP_DISTRIBUTION = [
  { bracket: '0 – 100', count: 8, color: 'bg-red-400' },
  { bracket: '100 – 500', count: 15, color: 'bg-orange-400' },
  { bracket: '500 – 1000', count: 22, color: 'bg-yellow-400' },
  { bracket: '1000 – 2000', count: 12, color: 'bg-green-400' },
  { bracket: '2000+', count: 5, color: 'bg-blue-500' },
];

const TOP_STUDENTS = [
  { name: 'Jonathan Junior', xp: 2450, level: 8, badges: 12, avatar: '🏆' },
  { name: 'Mary Grace', xp: 2100, level: 7, badges: 10, avatar: '⭐' },
  { name: 'Andrew Faith', xp: 1800, level: 6, badges: 8, avatar: '🌟' },
  { name: 'Sarah Hope', xp: 1550, level: 5, badges: 7, avatar: '💎' },
  { name: 'Mark David', xp: 1200, level: 4, badges: 5, avatar: '🔥' },
];

const RETENTION_FUNNEL = [
  { stage: 'Registered', stageAr: 'مسجل', count: 62, pct: 100 },
  { stage: 'First Lesson', stageAr: 'أول درس', count: 55, pct: 89 },
  { stage: 'First Quiz', stageAr: 'أول اختبار', count: 42, pct: 68 },
  { stage: '5-Day Streak', stageAr: 'سلسلة 5 أيام', count: 28, pct: 45 },
  { stage: '10 Lessons', stageAr: '10 دروس', count: 18, pct: 29 },
];

const CLASS_PERFORMANCE = [
  { name: 'Class A (Primary)', value: 85 },
  { name: 'Class B (Junior)', value: 65 },
  { name: 'Class C (Senior)', value: 92 },
];

const ENGAGEMENT_HEATMAP = [
  [3, 5, 7, 4, 6, 8, 9], // Week 1
  [2, 6, 8, 5, 7, 9, 10], // Week 2
  [4, 3, 6, 7, 8, 10, 8], // Week 3
  [5, 7, 9, 6, 5, 7, 6], // Week 4
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminAnalytics() {
  const tNav = useTranslations('nav');
  const tAnalytics = useTranslations('analytics');
  const tCommon = useTranslations('common');

  const isAr = tCommon('appName') !== 'JoyfulPath';

  const supabase = createClient();
  const [stats, setStats] = useState({
    totalStudents: 62,
    totalPointsRedeemed: 1450,
    totalPointsAwarded: 4250,
  });

  useEffect(() => {
    async function fetchStats() {
      // Mock fetching some basic stats from supabase
      const { count: studentCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
      if (studentCount) {
        setStats(prev => ({ ...prev, totalStudents: studentCount }));
      }
    }
    fetchStats();
  }, [supabase]);

  const redeemPct = Math.round((stats.totalPointsRedeemed / stats.totalPointsAwarded) * 100);

  const maxXpCount = Math.max(...XP_DISTRIBUTION.map(d => d.count));

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

      {/* ── Top Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: tAnalytics('attendanceAverage'), value: '88.5%', trend: '+4.2%', icon: 'event_available', iconBg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400' },
          { label: tAnalytics('completionRate'), value: '74.2%', trend: '+8.1%', icon: 'task_alt', iconBg: 'bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400' },
          { label: isAr ? 'إجمالي الطلاب' : 'Total Students', value: String(stats.totalStudents), trend: '+5', icon: 'groups', iconBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-500 dark:text-purple-400' },
          { label: tAnalytics('totalPointsRedeemed'), value: stats.totalPointsRedeemed.toLocaleString(), trend: '+320', icon: 'redeem', iconBg: 'bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400' },
        ].map((stat, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant/80 tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-on-surface">{stat.value}</h3>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-tertiary">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  {stat.trend}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Attendance Trend ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'اتجاه الحضور (8 أسابيع)' : 'Attendance Trend (8 Weeks)'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATTENDANCE_TREND} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/50" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--on-surface-variant)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--on-surface-variant)' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ── Weekly Active Users ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{tAnalytics('activeUsers')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ACTIVE} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/50" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--on-surface-variant)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--on-surface-variant)' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── XP Distribution ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'توزيع نقاط الخبرة' : 'Student XP Distribution'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {XP_DISTRIBUTION.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span>{d.bracket} XP</span>
                  <span>{d.count} {isAr ? 'طالب' : 'students'}</span>
                </div>
                <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-500`}
                    style={{ width: `${(d.count / maxXpCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Points Economy Donut ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'اقتصاد النقاط' : 'Points Economy'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col items-center gap-6">
            <div className="relative h-40 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Redeemed', value: stats.totalPointsRedeemed },
                      { name: 'Available', value: stats.totalPointsAwarded - stats.totalPointsRedeemed }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="var(--primary)" />
                    <Cell fill="var(--surface-container-high)" />
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-8">
                <span className="text-2xl font-extrabold text-on-surface">{redeemPct}%</span>
              </div>
            </div>
            <div className="flex gap-8 text-center mt-2">
              <div>
                <p className="text-xl font-extrabold text-on-surface">{stats.totalPointsAwarded.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{isAr ? 'ممنوحة' : 'Awarded'}</p>
              </div>
              <div className="w-px bg-outline-variant" />
              <div>
                <p className="text-xl font-extrabold text-primary">{stats.totalPointsRedeemed.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{isAr ? 'مستبدلة' : 'Redeemed'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Retention Funnel ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'قمع الاحتفاظ' : 'Retention Funnel'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {RETENTION_FUNNEL.map((step, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface">{isAr ? step.stageAr : step.stage}</span>
                  <span className="text-on-surface-variant">{step.count} ({step.pct}%)</span>
                </div>
                <div className="h-4 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Engagement Heatmap ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'خريطة التفاعل' : 'Engagement Heatmap'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-2">
              {/* Days header */}
              <div className="flex gap-2 ps-14">
                {DAYS.map(d => (
                  <div key={d} className="flex-1 text-center text-[10px] font-bold text-on-surface-variant">{d}</div>
                ))}
              </div>
              {/* Weeks */}
              {ENGAGEMENT_HEATMAP.map((week, wi) => (
                <div key={wi} className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-bold text-on-surface-variant text-end">{isAr ? `أسبوع ${wi + 1}` : `Week ${wi + 1}`}</span>
                  <div className="flex gap-2 flex-1">
                    {week.map((val, di) => {
                      const intensity = Math.min(val / 10, 1);
                      return (
                        <div
                          key={di}
                          className="flex-1 aspect-square rounded-lg cursor-pointer transition-transform duration-150 hover:scale-110"
                          style={{
                            backgroundColor: `rgba(0, 88, 190, ${0.1 + intensity * 0.8})`,
                          }}
                          title={`${DAYS[di]}: ${val} ${isAr ? 'نشاط' : 'activities'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 pt-2">
                <span className="text-[10px] font-bold text-on-surface-variant">{isAr ? 'أقل' : 'Less'}</span>
                {[0.15, 0.3, 0.5, 0.7, 0.9].map((o, i) => (
                  <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(0, 88, 190, ${o})` }} />
                ))}
                <span className="text-[10px] font-bold text-on-surface-variant">{isAr ? 'أكثر' : 'More'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Top Performers ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{isAr ? 'أفضل الطلاب' : 'Top Performers'}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-outline-variant/60">
              {TOP_STUDENTS.map((student, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-container/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center text-sm font-extrabold text-on-surface-variant bg-surface-container rounded-full">
                      {i + 1}
                    </span>
                    <span className="text-xl">{student.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{student.name}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant">
                        Level {student.level} • {student.badges} {isAr ? 'شارة' : 'badges'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-primary">{student.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Class Performance ── */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{tAnalytics('submissionProgress')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {CLASS_PERFORMANCE.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span>{c.name}</span>
                  <span>{tAnalytics('percentCompleted', { value: c.value })}</span>
                </div>
                <ProgressBar value={c.value} size="md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
