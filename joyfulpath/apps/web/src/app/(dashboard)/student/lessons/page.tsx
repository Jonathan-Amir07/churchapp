'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Modal, BadgeTag, ProgressBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface LessonAttachment {
  name: string;
  type: 'pdf' | 'image' | 'audio' | 'video';
  size: string;
}

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
  duration: string;
  objectives: string[];
  objectivesAr: string[];
  attachments: LessonAttachment[];
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
    verseAr: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.» — تكوين ١:١',
    contentEn: 'God created the light, sky, land, plants, sun, moon, stars, sea creatures, birds, land animals, and finally human beings in His own image over six days, and rested on the seventh.',
    contentAr: 'خلق الله النور، الجلد، الأرض، النباتات، الشمس والقمر والنجوم، حيوانات البحر والطيور، وحيوانات البرية، وأخيراً خلق الإنسان على صورته ومثاله في ستة أيام، واستراح في اليوم السابع.',
    levelRequired: 1,
    duration: '25 min',
    objectives: ['Understand the 7 days of creation', 'Memorize Genesis 1:1', 'Identify God as Creator of all things'],
    objectivesAr: ['فهم أيام الخلق السبعة', 'حفظ آية تكوين ١:١', 'التعرف على الله كخالق لكل شيء'],
    attachments: [
      { name: 'Creation_Days_Worksheet.pdf', type: 'pdf', size: '1.2 MB' },
      { name: 'Creation_Illustration.png', type: 'image', size: '820 KB' },
    ],
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
    verseAr: '«وَضَعْتُ قَوْسِي فِي السَّحَابِ فَتَكُونُ عَلاَمَةَ مِيثَاقٍ...» — تكوين ٩:١٣',
    contentEn: 'Noah was a righteous man. God told him to build an ark to save his family and pairs of every animal from a great flood. Afterward, God placed a rainbow in the sky as a promise to never flood the earth again.',
    contentAr: 'كان نوح رجلاً باراً. أمره الله ببناء فلك لخلاص عائلته وزوجين من كل نوع من الحيوانات من الطوفان العظيم. بعد ذلك، وضع الله قوس قزح في السماء كعلامة عهد بأنه لن يغرق الأرض بطوفان مرة أخرى.',
    levelRequired: 1,
    duration: '30 min',
    objectives: ['Learn about Noah\'s obedience to God', 'Understand the covenant of the rainbow', 'Know that God keeps His promises'],
    objectivesAr: ['التعرف على طاعة نوح لله', 'فهم عهد قوس قزح', 'معرفة أن الله يحفظ وعوده'],
    attachments: [
      { name: 'Noahs_Ark_Coloring.pdf', type: 'pdf', size: '950 KB' },
      { name: 'Rainbow_Promise_Audio.mp3', type: 'audio', size: '2.1 MB' },
    ],
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
    verseAr: '«لأَنَّ الْحَرْبَ لِلَّهِ وَهُوَ يَدْفَعُكُمْ لِيَدِنَا.» — صموئيل الأول ١٧:٤٧',
    contentEn: 'A young shepherd boy named David defeats the giant Philistine warrior Goliath with only a sling, five smooth stones, and faith in God, proving that God is stronger than any army.',
    contentAr: 'فتى راعٍ صغير يدعى داود يهزم العملاق الفلسطيني جليات بمقلاع وخمسة حجارة ملساء وإيمان عظيم بالله، ليثبت أن الله أقوى من أي جيش.',
    levelRequired: 2,
    duration: '35 min',
    objectives: ['Learn about faith and courage', 'Understand that God fights for His people', 'Memorize 1 Samuel 17:47'],
    objectivesAr: ['التعلم عن الإيمان والشجاعة', 'فهم أن الله يحارب عن شعبه', 'حفظ آية صموئيل الأول ١٧:٤٧'],
    attachments: [
      { name: 'David_Goliath_Story_Map.pdf', type: 'pdf', size: '1.5 MB' },
    ],
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
    verseAr: '«لأَنَّهُ يُولَدُ لَنَا وَلَدٌ وَنُعْطَى ابْنًا...» — إشعياء ٩:٦',
    contentEn: 'Jesus was born in Bethlehem to Mary. Angels announced His birth to shepherds in the fields, and a bright star guided wise men to bring gifts to the savior of the world.',
    contentAr: 'ولد يسوع في بيت لحم من مريم العذراء. أعلنت الملائكة ميلاده للرعاة في الحقول، وأرشد نجم ساطع المجوس ليقدموا له الهدايا مخلصاً للعالم.',
    levelRequired: 3,
    duration: '40 min',
    objectives: ['Learn about the prophecy of Jesus\' birth', 'Understand the significance of Bethlehem', 'Know about the wise men and shepherds'],
    objectivesAr: ['التعرف على نبوة ميلاد يسوع', 'فهم أهمية بيت لحم', 'معرفة قصة المجوس والرعاة'],
    attachments: [
      { name: 'Nativity_Scene_Activity.pdf', type: 'pdf', size: '2.3 MB' },
      { name: 'Christmas_Hymn.mp3', type: 'audio', size: '3.5 MB' },
    ],
  },
];

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-500 bg-red-50' },
  image: { icon: 'image', color: 'text-blue-500 bg-blue-50' },
  audio: { icon: 'headphones', color: 'text-purple-500 bg-purple-50' },
  video: { icon: 'videocam', color: 'text-teal-500 bg-teal-50' },
};

export default function StudentLessons() {
  const tNav = useTranslations('nav');
  const tLessons = useTranslations('lessons');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');
  const addToast = useNotificationStore(s => s.addToast);
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    async function fetchLessons() {
      const { data: lessonsData, error: lessonsError } = await supabase.from('lessons').select('*');
      if (lessonsError || !lessonsData) {
        setIsLoading(false);
        return;
      }
      
      const { data: attData } = await supabase.from('lesson_attachments').select('*');

      const mappedLessons: Lesson[] = lessonsData.map((l: any) => {
        const lessonAtts = (attData || []).filter((a: any) => a.lesson_id === l.id).map((a: any) => ({
          name: a.file_name,
          type: a.file_type as any,
          size: `${Math.round(a.file_size / 1024)} KB`,
        }));
        return {
          id: l.id,
          titleEn: l.title,
          titleAr: l.title_ar || l.title,
          categoryEn: l.category || 'General',
          categoryAr: l.category_ar || 'عام',
          status: 'not-started', // mock status
          xp: l.xp_reward || 50,
          points: l.points_reward || 10,
          verseEn: l.verse || '',
          verseAr: l.verse_ar || '',
          contentEn: l.content || '',
          contentAr: l.content || '',
          levelRequired: l.level_required || 1,
          duration: '30 min',
          objectives: ['Learn the lesson', 'Complete the worksheet'],
          objectivesAr: ['تعلم الدرس', 'أكمل ورقة العمل'],
          attachments: lessonAtts,
        };
      });
      setLessons(mappedLessons);
      setIsLoading(false);
    }
    fetchLessons();
  }, [supabase]);

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
    addToast(tLessons('completeSuccess', { xp: lesson.xp, points: lesson.points }), 'success');
  };

  const handleDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      addToast(isAr ? `تم تنزيل الملف: ${fileName}` : `Downloaded: ${fileName}`, 'success');
    }, 1200);
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

                {/* Duration & Attachments info */}
                <div className="flex items-center gap-4 text-[11px] font-bold text-on-surface-variant/80">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {lesson.duration}
                  </span>
                  {lesson.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">attach_file</span>
                      {lesson.attachments.length} {isAr ? 'مرفقات' : 'files'}
                    </span>
                  )}
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

        {filteredLessons.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">menu_book</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tLessons('noLessons')}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="col-span-full flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Lesson Details Dialog */}
      {selectedLesson && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLesson(null)}
          title={isAr ? selectedLesson.titleAr : selectedLesson.titleEn}
        >
          <div className="space-y-6 pt-2">
            {/* Memorization Verse */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                {tLessons('verses')}
              </h4>
              <p className="text-sm font-black text-on-surface italic leading-relaxed">
                {isAr ? selectedLesson.verseAr : selectedLesson.verseEn}
              </p>
            </div>

            {/* Duration & Level */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {selectedLesson.duration}
              </span>
              <span className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                {tLessons('reqLevelLabel', { level: selectedLesson.levelRequired })}
              </span>
            </div>

            {/* Lesson Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {isAr ? 'أهداف الدرس' : 'Lesson Objectives'}
              </h4>
              <ul className="space-y-1.5">
                {(isAr ? selectedLesson.objectivesAr : selectedLesson.objectives).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {tLessons('lessonContent')}
              </h4>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {isAr ? selectedLesson.contentAr : selectedLesson.contentEn}
              </p>
            </div>

            {/* Attachments */}
            {selectedLesson.attachments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">attach_file</span>
                  {isAr ? 'المرفقات' : 'Attachments'}
                </h4>
                <div className="space-y-2">
                  {selectedLesson.attachments.map((file, idx) => {
                    const fileStyle = FILE_ICONS[file.type] || FILE_ICONS.pdf;
                    const isDownloading = downloadingFile === file.name;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-surface-container rounded-xl border border-outline-variant/60 hover:bg-surface-container-high transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${fileStyle.color}`}>
                            <span className="material-symbols-outlined text-[18px]">{fileStyle.icon}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-on-surface">{file.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{file.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(file.name); }}
                          disabled={isDownloading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors duration-150 disabled:opacity-50"
                        >
                          <span className={`material-symbols-outlined text-[16px] ${isDownloading ? 'animate-spin' : ''}`}>
                            {isDownloading ? 'progress_activity' : 'download'}
                          </span>
                          {isDownloading ? (isAr ? 'جاري...' : 'Loading...') : (isAr ? 'تنزيل' : 'Download')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

