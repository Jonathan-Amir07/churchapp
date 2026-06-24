'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Modal, BadgeTag } from '@/components/ui';

interface Lesson {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'locked';
  xp: number;
  points: number;
  verseEn: string;
  verseAr: string;
  contentEn: string;
  contentAr: string;
  levelRequired: number;
}

const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    titleEn: 'Lesson 1: The Story of Creation',
    titleAr: 'الدرس ١: قصة الخلق',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    status: 'completed',
    xp: 50,
    points: 10,
    verseEn: '"In the beginning, God created the heavens and the earth." — Genesis 1:1',
    verseAr: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.» — تكوين ١:١',
    contentEn: 'God created the light, sky, land, plants, sun, moon, stars, sea creatures, birds, land animals, and finally human beings in His own image over six days, and rested on the seventh.',
    contentAr: 'خلق الله النور، الجلد، الأرض، النباتات، الشمس والقمر والنجوم، حيوانات البحر والطيور، وحيوانات البرية، وأخيراً خلق الإنسان على صورته ومثاله في ستة أيام، واستراح في اليوم السابع.',
    levelRequired: 1,
  },
  {
    id: '2',
    titleEn: "Lesson 2: Noah's Ark & The Rainbow Promise",
    titleAr: 'الدرس ٢: فلك نوح وعهد قوس قزح',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    status: 'in-progress',
    xp: 50,
    points: 10,
    verseEn: '"I have set my rainbow in the clouds, and it will be the sign of the covenant..." — Genesis 9:13',
    verseAr: '«وَضَعْتُ قَوْسِي فِي السَّحَابِ فَتَكُونُ عَلاَمَةَ مِيثَاقٍ...» — تكوين ٩:١٣',
    contentEn: 'Noah was a righteous man. God told him to build an ark to save his family and pairs of every animal from a great flood. Afterward, God placed a rainbow in the sky as a promise to never flood the earth again.',
    contentAr: 'كان نوح رجلاً باراً. أمره الله ببناء فلك لخلاص عائلته وزوجين من كل نوع من الحيوانات من الطوفان العظيم. بعد ذلك، وضع الله قوس قزح في السماء كعلامة عهد بأنه لن يغرق الأرض بطوفان مرة أخرى.',
    levelRequired: 1,
  },
  {
    id: '3',
    titleEn: "Lesson 3: David and Goliath's Mighty Battle",
    titleAr: 'الدرس ٣: داود وجليات والمعركة العظيمة',
    categoryEn: 'Kingdoms',
    categoryAr: 'الملوك',
    status: 'not-started',
    xp: 50,
    points: 10,
    verseEn: '"The Lord does not save with sword and spear; for the battle is the Lord\'s..." — 1 Samuel 17:47',
    verseAr: '«لأَنَّ الْحَرْبَ لِلَّهِ وَهُوَ يَدْفَعُكُمْ لِيَدِنَا.» — صموئيل الأول ١٧:٤٧',
    contentEn: 'A young shepherd boy named David defeats the giant Philistine warrior Goliath with only a sling, five smooth stones, and faith in God, proving that God is stronger than any army.',
    contentAr: 'فتى راعٍ صغير يدعى داود يهزم العملاق الفلسطيني جليات بمقلاع وخمسة حجارة ملساء وإيمان عظيم بالله، ليثبت أن الله أقوى من أي جيش.',
    levelRequired: 2,
  },
  {
    id: '4',
    titleEn: 'Lesson 4: The Birth of Jesus Christ',
    titleAr: 'الدرس ٤: ميلاد يسوع المسيح',
    categoryEn: 'Gospel',
    categoryAr: 'الإنجيل',
    status: 'locked',
    xp: 50,
    points: 10,
    verseEn: '"For to us a child is born, to us a son is given..." — Isaiah 9:6',
    verseAr: '«لأَنَّهُ يُولَدُ لَنَا وَلَدٌ وَنُعْطَى ابْنًا...» — إشعياء ٩:٦',
    contentEn: 'Jesus was born in Bethlehem to Mary. Angels announced His birth to shepherds in the fields, and a bright star guided wise men to bring gifts to the savior of the world.',
    contentAr: 'ولد يسوع في بيت لحم من مريم العذراء. أعلنت الملائكة ميلاده للرعاة في الحقول، وأرشد نجم ساطع المجوس ليقدموا له الهدايا مخلصاً للعالم.',
    levelRequired: 3,
  },
];

export default function StudentLessons() {
  const tNav = useTranslations('nav');
  const tLessons = useTranslations('lessons');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const filteredLessons = lessons.filter((lesson) => {
    const title = (lesson.titleEn + ' ' + lesson.titleAr).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'completed') return lesson.status === 'completed' && matchesSearch;
    if (filter === 'in-progress') return lesson.status === 'in-progress' && matchesSearch;
    if (filter === 'not-started') return lesson.status === 'not-started' && matchesSearch;
    return matchesSearch;
  });

  const handleStart = (lesson: Lesson) => {
    setLessons(prev =>
      prev.map(l => (l.id === lesson.id && l.status === 'not-started' ? { ...l, status: 'in-progress' } : l))
    );
    setSelectedLesson({ ...lesson, status: 'in-progress' });
  };

  const handleComplete = (lesson: Lesson) => {
    setLessons(prev =>
      prev.map(l => (l.id === lesson.id ? { ...l, status: 'completed' } : l))
    );
    setSelectedLesson(null);
    alert(tLessons('completeSuccess', { xp: lesson.xp, points: lesson.points }));
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('lessons')}
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
          {tLessons('chooseAdventure')}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder={tCommon('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 ps-10 pe-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary text-sm font-medium"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-[20px]">
            search
          </span>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-1 bg-surface-container-low p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'completed', 'in-progress', 'not-started'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all duration-150 whitespace-nowrap ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tLessons(tab === 'all' ? 'masterYourQuest' : tab === 'completed' ? 'completed' : tab === 'in-progress' ? 'inProgress' : 'notStarted')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => {
          const isAr = tCommon('appName') !== 'JoyfulPath'; // Quick check if Arabic is currently active
          const title = isAr ? lesson.titleAr : lesson.titleEn;
          const category = isAr ? lesson.categoryAr : lesson.categoryEn;

          return (
            <Card
              key={lesson.id}
              variant={lesson.status === 'locked' ? 'default' : 'interactive'}
              onClick={() => lesson.status !== 'locked' && setSelectedLesson(lesson)}
              className={`border border-outline-variant relative overflow-hidden flex flex-col justify-between ${
                lesson.status === 'locked' ? 'opacity-60 bg-surface-container-low' : 'bg-surface-container-lowest'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <BadgeTag variant={lesson.status === 'completed' ? 'success' : lesson.status === 'in-progress' ? 'warning' : 'outline'}>
                    {tLessons(lesson.status === 'completed' ? 'completed' : lesson.status === 'in-progress' ? 'inProgress' : lesson.status === 'locked' ? 'notStarted' : 'notStarted')}
                  </BadgeTag>
                  <span className="text-xs font-bold text-outline">{category}</span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-on-surface leading-tight">
                    {title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs md:text-sm">
                    {isAr ? lesson.contentAr : lesson.contentEn}
                  </CardDescription>
                </div>

                {lesson.status === 'locked' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-error">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>{tLessons('requiresLevel', { level: lesson.levelRequired })}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      +{lesson.xp} XP
                    </span>
                    <span className="text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      +{lesson.points} {tGamification('points')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredLessons.length === 0 && (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">menu_book</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tLessons('noLessons')}</p>
          </div>
        )}
      </div>

      {/* Lesson Details Dialog */}
      {selectedLesson && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLesson(null)}
          title={tCommon('appName') !== 'JoyfulPath' ? selectedLesson.titleAr : selectedLesson.titleEn}
        >
          <div className="space-y-6 pt-2">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                {tLessons('verses')}
              </h4>
              <p className="text-sm font-black text-on-surface italic leading-relaxed">
                {tCommon('appName') !== 'JoyfulPath' ? selectedLesson.verseAr : selectedLesson.verseEn}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {tLessons('lessonContent')}
              </h4>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {tCommon('appName') !== 'JoyfulPath' ? selectedLesson.contentAr : selectedLesson.contentEn}
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>
                {tCommon('cancel')}
              </Button>
              {selectedLesson.status === 'not-started' && (
                <Button variant="primary" size="sm" onClick={() => handleStart(selectedLesson)}>
                  {tLessons('openLesson')}
                </Button>
              )}
              {selectedLesson.status === 'in-progress' && (
                <Button variant="success" size="sm" onClick={() => handleComplete(selectedLesson)}>
                  {tLessons('completed')}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
