'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Modal, Button } from '@/components/ui';

interface Badge {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  color: string;
}

const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    nameEn: 'Attendance Starter',
    nameAr: 'مستكشف البداية',
    descriptionEn: 'Attend your very first Sunday School class.',
    descriptionAr: 'حضور أول حصة لك في مدارس الأحد.',
    unlocked: true,
    unlockedAt: '2026-06-10',
    icon: 'event_available',
    color: 'bg-green-100 text-green-600 border-green-200',
  },
  {
    id: 'b2',
    nameEn: 'Quiz Champion',
    nameAr: 'بطل الاختبارات',
    descriptionEn: 'Score 100% correct answers on any quiz.',
    descriptionAr: 'الحصول على درجة ١٠٠٪ في أي اختبار.',
    unlocked: true,
    unlockedAt: '2026-06-15',
    icon: 'quiz',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  },
  {
    id: 'b3',
    nameEn: 'Verse Master',
    nameAr: 'حافظ الآيات',
    descriptionEn: 'Memorize and successfully submit 5 scripture verses.',
    descriptionAr: 'حفظ وتسميع ٥ آيات من الكتاب المقدس بنجاح.',
    unlocked: true,
    unlockedAt: '2026-06-20',
    icon: 'menu_book',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  {
    id: 'b4',
    nameEn: 'Lesson Explorer',
    nameAr: 'مكتشف الدروس',
    descriptionEn: 'Complete 5 active learning lessons.',
    descriptionAr: 'إكمال ٥ دروس تعليمية نشطة.',
    unlocked: false,
    icon: 'travel_explore',
    color: 'bg-slate-100 text-slate-400 border-slate-200',
  },
  {
    id: 'b5',
    nameEn: 'Top Ranker',
    nameAr: 'أبطال الصدارة',
    descriptionEn: 'Reach the top 3 on the leaderboard.',
    descriptionAr: 'الوصول إلى المراكز الثلاثة الأولى في قائمة المتصدرين.',
    unlocked: false,
    icon: 'leaderboard',
    color: 'bg-slate-100 text-slate-400 border-slate-200',
  },
  {
    id: 'b6',
    nameEn: 'Heavenly Star',
    nameAr: 'النجم السماوي',
    descriptionEn: 'Reach Level 15 (Heavenly Star status).',
    descriptionAr: 'الوصول إلى المستوى ١٥ (رتبة النجم السماوي).',
    unlocked: false,
    icon: 'grade',
    color: 'bg-slate-100 text-slate-400 border-slate-200',
  },
];

export default function StudentBadges() {
  const tNav = useTranslations('nav');
  const tGamification = useTranslations('gamification');
  const tCommon = useTranslations('common');
  const tBadges = useTranslations('badges');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedCount = MOCK_BADGES.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('badges')}
          </h1>
          <span className="text-xs font-black bg-secondary/10 text-secondary px-3 py-1.5 rounded-full border border-secondary/20">
            {unlockedCount} / {MOCK_BADGES.length} {tNav('badges')}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
          {tBadges('description')}
        </p>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {MOCK_BADGES.map((badge) => {
          const name = isAr ? badge.nameAr : badge.nameEn;
          const description = isAr ? badge.descriptionAr : badge.descriptionEn;

          return (
            <Card
              key={badge.id}
              variant={badge.unlocked ? 'interactive' : 'default'}
              onClick={() => setSelectedBadge(badge)}
              className={`border text-center flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-200 ${
                badge.unlocked
                  ? 'border-outline-variant hover:border-primary/40 bg-surface-container-lowest'
                  : 'border-outline-variant/40 bg-surface-container-low opacity-65'
              }`}
            >
              {/* Badge Icon container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 mb-4 transition-transform duration-350 ${
                  badge.unlocked ? badge.color + ' group-hover:scale-105' : 'bg-surface-container border-outline-variant text-outline'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[32px]"
                  style={{ fontVariationSettings: badge.unlocked ? "'FILL' 1" : undefined }}
                >
                  {badge.icon}
                </span>
              </div>

              {/* Title & Status */}
              <div className="space-y-1 w-full">
                <CardTitle className="text-sm md:text-base font-black text-on-surface truncate">
                  {name}
                </CardTitle>
                <p className="text-[10px] md:text-xs font-black uppercase text-outline">
                  {badge.unlocked ? tGamification('badgeUnlocked') : tBadges('locked')}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedBadge && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBadge(null)}
          title={tGamification('badgeUnlocked')}
        >
          <div className="text-center space-y-6 pt-2 select-none">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-4 mx-auto ${
                selectedBadge.unlocked
                  ? selectedBadge.color
                  : 'bg-surface-container border-outline-variant text-outline'
              }`}
            >
              <span
                className="material-symbols-outlined text-[48px]"
                style={{ fontVariationSettings: selectedBadge.unlocked ? "'FILL' 1" : undefined }}
              >
                {selectedBadge.icon}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-on-surface">
                {tCommon('appName') !== 'newsl w nwasl ll sama' ? selectedBadge.nameAr : selectedBadge.nameEn}
              </h3>
              <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                {tCommon('appName') !== 'newsl w nwasl ll sama' ? selectedBadge.descriptionAr : selectedBadge.descriptionEn}
              </p>
            </div>

            {selectedBadge.unlocked && selectedBadge.unlockedAt && (
              <p className="text-xs text-outline font-bold">
                {tBadges('unlockedOn', { date: new Date(selectedBadge.unlockedAt).toLocaleDateString() })}
              </p>
            )}

            <div className="pt-4 border-t border-outline-variant">
              <Button variant="primary" size="sm" onClick={() => setSelectedBadge(null)}>
                {tCommon('back')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

