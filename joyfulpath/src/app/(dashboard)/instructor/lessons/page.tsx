'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, Input } from '@/components/ui';

interface LessonAttachment {
  name: string;
  type: string;
  size: string;
}

interface Lesson {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  verseEn: string;
  verseAr: string;
  levelRequired: number;
  attachments: LessonAttachment[];
}

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-500 bg-red-50' },
  image: { icon: 'image', color: 'text-blue-500 bg-blue-50' },
  audio: { icon: 'headphones', color: 'text-purple-500 bg-purple-50' },
  video: { icon: 'videocam', color: 'text-teal-500 bg-teal-50' },
};

const INITIAL_LESSONS: Lesson[] = [
  {
    id: '1',
    titleEn: 'The Story of Creation',
    titleAr: 'قصة الخلق',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    verseEn: '"In the beginning, God created the heavens and the earth." — Genesis 1:1',
    verseAr: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.» — تكوين ١:١',
    levelRequired: 1,
    attachments: [
      { name: 'Creation_Days_Worksheet.pdf', type: 'pdf', size: '1.2 MB' },
      { name: 'Creation_Illustration.png', type: 'image', size: '820 KB' },
    ],
  },
  {
    id: '2',
    titleEn: "Noah's Ark & The Rainbow Promise",
    titleAr: 'فلك نوح وعهد قوس قزح',
    categoryEn: 'Genesis',
    categoryAr: 'التكوين',
    verseEn: '"I have set my rainbow in the clouds..." — Genesis 9:13',
    verseAr: '«وَضَعْتُ قَوْسِي فِي السَّحَابِ...» — تكوين ٩:١٣',
    levelRequired: 1,
    attachments: [
      { name: 'Noahs_Ark_Coloring.pdf', type: 'pdf', size: '950 KB' },
    ],
  },
];

export default function InstructorLessons() {
  const tNav = useTranslations('nav');
  const tLessons = useTranslations('lessons');
  const tCommon = useTranslations('common');

  const isAr = tCommon('appName') !== 'JoyfulPath';
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('Genesis');
  const [categoryAr, setCategoryAr] = useState('التكوين');
  const [verseEn, setVerseEn] = useState('');
  const [verseAr, setVerseAr] = useState('');
  const [levelReq, setLevelReq] = useState(1);
  const [formAttachments, setFormAttachments] = useState<LessonAttachment[]>([]);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const size = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let type = 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) type = 'image';
    else if (['mp3', 'wav', 'ogg'].includes(ext)) type = 'audio';
    else if (['mp4', 'webm', 'mov'].includes(ext)) type = 'video';

    setFormAttachments(prev => [...prev, { name: file.name, type, size }]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (idx: number) => {
    setFormAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr || !verseEn || !verseAr) {
      alert(tLessons('fillAllFields'));
      return;
    }

    const newLesson: Lesson = {
      id: String(Date.now()),
      titleEn,
      titleAr,
      categoryEn,
      categoryAr,
      verseEn,
      verseAr,
      levelRequired: Number(levelReq),
      attachments: formAttachments,
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
    setFormAttachments([]);
  };

  const getFileIcon = (type: string) => FILE_ICONS[type] || FILE_ICONS.pdf;

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

                {/* Attachment Tags */}
                {lesson.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.attachments.map((file, idx) => {
                      const style = getFileIcon(file.type);
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${style.color} border border-current/10`}
                        >
                          <span className="material-symbols-outlined text-[12px]">{style.icon}</span>
                          {file.name.length > 18 ? file.name.slice(0, 18) + '...' : file.name}
                        </span>
                      );
                    })}
                  </div>
                )}

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
              <Input required value={verseAr} onChange={(e) => setVerseAr(e.target.value)} placeholder='مثال: «أَسْتَطِيعُ كُلَّ شَيْءٍ...» — فيلبي ٤:١٣' />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tLessons('unlockLevelReq')}</label>
              <Input type="number" min={1} max={15} required value={levelReq} onChange={(e) => setLevelReq(Number(e.target.value))} />
            </div>

            {/* File Attachments Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">attach_file</span>
                {isAr ? 'المرفقات' : 'Attachments'}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*,video/*,.pdf"
                onChange={handleAddFile}
                className="hidden"
              />

              {formAttachments.length > 0 && (
                <div className="space-y-2">
                  {formAttachments.map((file, idx) => {
                    const style = getFileIcon(file.type);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-surface-container rounded-lg border border-outline-variant/60">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.color}`}>
                            <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-on-surface">{file.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{file.size}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveAttachment(idx)} className="p-1 hover:bg-error/10 rounded transition-colors">
                          <span className="material-symbols-outlined text-[16px] text-error">close</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-outline-variant rounded-xl p-4 text-center hover:bg-surface-container hover:border-primary/50 transition-all duration-150 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px] text-outline">add_circle</span>
                <p className="text-xs text-on-surface-variant font-bold mt-1">
                  {isAr ? 'إضافة ملف مرفق' : 'Add attachment file'}
                </p>
              </button>
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
