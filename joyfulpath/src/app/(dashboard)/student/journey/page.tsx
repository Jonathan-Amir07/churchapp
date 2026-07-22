'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, ProgressBar, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';

export default function MyJourneyPage() {
  const currentLocale = useLocale();
  const tNav = useTranslations('nav');
  
  const { xp, level, points, streak, readingPlans, memorizedVerses } = useAppStore();

  const totalChapters = readingPlans.reduce((acc, p) => acc + p.chapters.length, 0);
  const readChapters = readingPlans.reduce((acc, p) => acc + p.chapters.filter(c => c.read).length, 0);
  const readingProgress = totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;

  const masteredVerses = memorizedVerses.filter(v => v.isMastered).length;
  
  const defaultBadges = [
    { id: 'b1', unlocked: true },
    { id: 'b2', unlocked: true },
    { id: 'b3', unlocked: false },
    { id: 'b4', unlocked: false }
  ];
  const unlockedBadges = defaultBadges.filter(b => b.unlocked).length;

  const journeyMilestones = [
    { title: 'First Steps in Faith', titleAr: 'خطوات أُولى في الإيمان', desc: 'Joined JoyfulPath Sunday School platform', descAr: 'الانضمام لمنصة مسار الفرح لمدارس الأحد', done: true, date: '2026-01-01' },
    { title: 'Scripture Explorer', titleAr: 'مستكشف آيات الإنجيل', desc: 'Completed first 5 Bible reading chapters', descAr: 'إتمام أول ٥ إصحاحات من قراءة الإنجيل', done: readChapters >= 5, date: '2026-02-15' },
    { title: 'Prayer Warrior', titleAr: 'مُصلي المواظب', desc: 'Completed 7-day streak in daily prayers', descAr: 'المواظبة على الصلوات لمدة ٧ أيام متتالية', done: streak >= 7, date: '2026-03-01' },
    { title: 'Saint Scholar', titleAr: 'خبير القديسين', desc: 'Mastered 3 memory verses and unlocked Saint badges', descAr: 'إتقان ٣ آيات وحفظ شارات القديسين', done: masteredVerses >= 3, date: '2026-04-10' },
  ];

  return (
    <div className="space-y-8 animate-[slide-up_0.4s_ease-out]">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary rounded-3xl p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black border border-white/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">church</span>
              {currentLocale === 'en' ? 'Spiritual Growth Tracker' : 'متابع النمو الروحي'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black">
              {currentLocale === 'en' ? 'My Journey with Christ' : 'رحلتي مع المسيح'}
            </h1>
            <p className="text-sm opacity-90 font-medium max-w-xl">
              {currentLocale === 'en'
                ? 'Track your spiritual progress, scripture reading, attendance, badges, and milestones all in one place.'
                : 'تابع تقدمك الروحي، قراءات الإنجيل، نسبة الحضور والشارات في مكان واحد.'}
            </p>
          </div>

          <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <span className="text-xs opacity-80 block font-bold">{currentLocale === 'en' ? 'Level' : 'المستوى'}</span>
              <span className="text-2xl font-black text-secondary">{level}</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-xs opacity-80 block font-bold">{currentLocale === 'en' ? 'Total XP' : 'النقاط'}</span>
              <span className="text-2xl font-black">{xp}</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-xs opacity-80 block font-bold">{currentLocale === 'en' ? 'Streak' : 'المواظبة'}</span>
              <span className="text-2xl font-black text-secondary flex items-center justify-center gap-0.5">
                🔥 {streak}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bible Reading Stats */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-base">
                  {currentLocale === 'en' ? 'Scripture Reading' : 'قراءة الكتاب المقدس'}
                </h3>
              </div>
              <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">{readingProgress}%</span>
            </div>
            <ProgressBar value={readingProgress} size="md" />
            <p className="text-xs text-on-surface-variant font-bold">
              {readChapters} / {totalChapters} {currentLocale === 'en' ? 'Chapters Completed' : 'إصحاح مكتمل'}
            </p>
          </CardContent>
        </Card>

        {/* Verses Mastered Stats */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary-container">
                  <span className="material-symbols-outlined">bookmark</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-base">
                  {currentLocale === 'en' ? 'Verses Mastered' : 'الآيات المحفوظة'}
                </h3>
              </div>
              <span className="text-xs font-black text-secondary-container bg-secondary/10 px-2.5 py-1 rounded-full">{masteredVerses}</span>
            </div>
            <ProgressBar value={memorizedVerses.length > 0 ? (masteredVerses / memorizedVerses.length) * 100 : 0} size="md" />
            <p className="text-xs text-on-surface-variant font-bold">
              {masteredVerses} / {memorizedVerses.length} {currentLocale === 'en' ? 'Verses 100% Mastered' : 'آية متقنة تماماً'}
            </p>
          </CardContent>
        </Card>

        {/* Badges Unlocked */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-base">
                  {currentLocale === 'en' ? 'Badges Unlocked' : 'الشارات المحققة'}
                </h3>
              </div>
              <span className="text-xs font-black text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-full">{unlockedBadges}</span>
            </div>
            <ProgressBar value={defaultBadges.length > 0 ? (unlockedBadges / defaultBadges.length) * 100 : 0} size="md" />
            <p className="text-xs text-on-surface-variant font-bold">
              {unlockedBadges} / {defaultBadges.length} {currentLocale === 'en' ? 'Badges Earned' : 'شارة محصلة'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spiritual Journey Timeline */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">timeline</span>
            {currentLocale === 'en' ? 'Milestone Timeline' : 'تسلسل الإنجازات والمحطات'}
          </h2>

          <div className="relative border-s-2 border-primary/20 start-4 space-y-8 py-2">
            {journeyMilestones.map((ms, idx) => (
              <div key={idx} className="relative ps-8">
                <div className={`absolute -start-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  ms.done
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant'
                }`}>
                  {ms.done ? '✓' : idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-extrabold text-on-surface">
                      {currentLocale === 'en' ? ms.title : ms.titleAr}
                    </h4>
                    {ms.done && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase">
                        {currentLocale === 'en' ? 'Completed' : 'مكتمل'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {currentLocale === 'en' ? ms.desc : ms.descAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
