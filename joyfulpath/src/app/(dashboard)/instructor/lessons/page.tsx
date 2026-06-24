'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, Input } from '@/components/ui';

interface Lesson {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  verseEn: string;
  verseAr: string;
  levelRequired: number;
}

const INITIAL_LESSONS: Lesson[] = [
  {
    id: '1',
    titleEn: 'The Story of Creation',
    titleAr: 'قصة الخلق',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    verseEn: '"In the beginning, God created the heavens and the earth." — Genesis 1:1',
    verseAr: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.» — تكوين ١:١',
    levelRequired: 1,
  },
  {
    id: '2',
    titleEn: "Noah's Ark & The Rainbow Promise",
    titleAr: 'فلك نوح وعهد قوس قزح',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    verseEn: '"I have set my rainbow in the clouds..." — Genesis 9:13',
    verseAr: '«وَضَعْتُ قَوْسِي فِي السَّحَابِ...» — تكوين ٩:١٣',
    levelRequired: 1,
  },
];

export default function InstructorLessons() {
  const tNav = useTranslations('nav');
  const tLessons = useTranslations('lessons');
  const tCommon = useTranslations('common');

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('Genesis');
  const [categoryAr, setCategoryAr] = useState('التكوين');
  const [verseEn, setVerseEn] = useState('');
  const [verseAr, setVerseAr] = useState('');
  const [levelReq, setLevelReq] = useState(1);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr || !verseEn || !verseAr) {
      alert(tLessons('fillAllFields'));
      return;
    }

    const newLesson: Lesson = {
      id: String(lessons.length + 1),
      titleEn,
      titleAr,
      categoryEn,
      categoryAr,
      verseEn,
      verseAr,
      levelRequired: Number(levelReq),
    };

    setLessons((prev) => [newLesson, ...prev]);
    setIsOpen(false);
    alert(tLessons('addSuccess'));

    // Reset Form
    setTitleEn('');
    setTitleAr('');
    setVerseEn('');
    setVerseAr('');
    setLevelReq(1);
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('lessons')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tLessons('instructorDescription')}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add" iconPosition="start">
          {tLessons('createLesson')}
        </Button>
      </div>

      {/* List of lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
          const title = isAr ? lesson.titleAr : lesson.titleEn;
          const category = isAr ? lesson.categoryAr : lesson.categoryEn;
          const verse = isAr ? lesson.verseAr : lesson.verseEn;

          return (
            <Card key={lesson.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-primary">
                    {category}
                  </span>
                  <span className="text-xs font-bold text-outline">
                    {tLessons('reqLevelLabel', { level: lesson.levelRequired })}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-on-surface leading-tight">
                    {title}
                  </CardTitle>
                  <p className="text-xs text-on-surface-variant italic leading-relaxed bg-surface-container p-3 rounded-xl border border-outline-variant/60">
                    {verse}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                    {tCommon('edit')}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-3 text-xs text-error hover:bg-error/5 hover:text-error border-outline-variant/60">
                    {tCommon('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {lessons.length === 0 && (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">menu_book</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tLessons('noLessons')}</p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tLessons('createLesson')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tLessons('titleEn')}</label>
                <Input required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. David & Goliath" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tLessons('titleAr')}</label>
                <Input required value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: داود وجليات" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tLessons('categoryEn')}</label>
                <Input required value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tLessons('categoryAr')}</label>
                <Input required value={categoryAr} onChange={(e) => setCategoryAr(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tLessons('verseEn')}</label>
              <Input required value={verseEn} onChange={(e) => setVerseEn(e.target.value)} placeholder='e.g. "I can do all things..." — Philippians 4:13' />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tLessons('verseAr')}</label>
              <Input required value={verseAr} onChange={(e) => setVerseAr(e.target.value)} placeholder='مثال: «أَسْتَطِيعُ كُلَّ شَيْءٍ...» — فيلبي ٤:١٣' />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tLessons('unlockLevelReq')}</label>
              <Input type="number" min={1} max={15} required value={levelReq} onChange={(e) => setLevelReq(Number(e.target.value))} />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tLessons('publish')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
