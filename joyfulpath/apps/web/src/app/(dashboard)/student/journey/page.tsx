'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, ProgressBar, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';

export default function MyJourneyPage() {
  const currentLocale = useLocale();
  const tNav = useTranslations('nav');
  const [activeNode, setActiveNode] = useState<number | null>(3);
  
  const { xp, level, points, streak, readingPlans, memorizedVerses } = useAppStore();

  const totalChapters = readingPlans.reduce((acc: number, p: { chapters: any[] }) => acc + p.chapters.length, 0);
  const readChapters = readingPlans.reduce((acc: number, p: { chapters: { read: boolean }[] }) => acc + p.chapters.filter(c => c.read).length, 0);
  const readingProgress = totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;
  const masteredVerses = memorizedVerses.filter((v: { isMastered: boolean }) => v.isMastered).length;

  const mapNodes = [
    { id: 1, titleEn: 'Day 1: Genesis 1', titleAr: 'اليوم ١: سفر التكوين ١', status: 'completed', top: '82%', right: '15%' },
    { id: 2, titleEn: 'Day 2: Genesis 2', titleAr: 'اليوم ٢: سفر التكوين ٢', status: 'completed', top: '65%', right: '70%' },
    { id: 3, titleEn: 'Day 3: Genesis 3', titleAr: 'اليوم ٣: سفر التكوين ٣', status: 'current', top: '45%', right: '25%' },
    { id: 4, titleEn: 'Day 4: Genesis 4', titleAr: 'اليوم ٤: سفر التكوين ٤', status: 'locked', top: '25%', right: '65%' },
    { id: 5, titleEn: 'Destination: Church', titleAr: 'المحطة الأخيرة: الكنيسة', status: 'destination', top: '5%', right: '45%' },
  ];

  return (
    <div className="space-y-8 animate-[slide-up_0.4s_ease-out]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-primary">
            {currentLocale === 'en' ? 'Coptic Quest - Reading Journey' : 'رحلة القراءة الكنسية'}
          </h1>
          <p className="text-sm text-outline font-medium">
            {currentLocale === 'en'
              ? 'Complete your daily scripture readings to advance along the holy path.'
              : 'أكمل قراءتك اليومية لتتقدم في رحلتك الروحية نحو الكنيسة.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface-container px-4 py-2 rounded-2xl border border-outline-variant shrink-0">
          <div className="text-center">
            <span className="text-xs text-outline font-bold block">{currentLocale === 'en' ? 'Level' : 'المستوى'}</span>
            <span className="text-xl font-black text-secondary">{level}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant" />
          <div className="text-center">
            <span className="text-xs text-outline font-bold block">{currentLocale === 'en' ? 'XP' : 'النقاط'}</span>
            <span className="text-xl font-black text-primary">{xp}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant" />
          <div className="text-center">
            <span className="text-xs text-outline font-bold block">{currentLocale === 'en' ? 'Streak' : 'المواظبة'}</span>
            <span className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
              🔥 {streak}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Map Container */}
      <div className="relative w-full h-[750px] md:h-[850px] rounded-[3rem] overflow-hidden border-8 border-surface-container-highest shadow-[0px_16px_0px_0px_#dee2ed] bg-surface-container-low flex flex-col">
        {/* Landscape Background */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom opacity-85 mix-blend-multiply"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAywKeWTrmmxXzkysQKuQmbvMuVHCWLoiLAcyQaPbMekeKOJ_fHiOVgJ28JYwpICYAquK-rPaMdCHlj7NqoU8hzyb5gTcHskNNQboLad2j598CaCWjQUNf6wFOub3e-2Fd_ZeqLexzqI8XpmmwFLPoQ-yUFREerg0Gfa3x2yOE59P_sC1Hv6ZzqDTspV7ux8i6ZhMJ59YwnE7bixeW66kEHeFDQMKiXDsqNZDZ0cTWhnyVzSU7Y4qv0hF9kILYVwebmsqHjpIQ1NNw')`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-bright/70 via-transparent to-surface-container/60 pointer-events-none" />

        {/* SVG Winding Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 20 90 C 20 70, 80 80, 80 60 C 80 40, 30 50, 30 30 C 30 15, 70 20, 70 10" fill="none" stroke="#dce1ff" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="3" />
          <path className="opacity-60" d="M 20 90 C 20 70, 80 80, 80 60 C 80 40, 30 50, 30 30 C 30 15, 70 20, 70 10" fill="none" stroke="#214fc7" strokeDasharray="6 6" strokeDashoffset="40" strokeLinecap="round" strokeWidth="3" />
        </svg>

        {/* Checkpoint Nodes */}
        {mapNodes.map((node) => {
          if (node.status === 'destination') {
            return (
              <div key={node.id} className="absolute z-20 flex flex-col items-center gap-2" style={{ top: node.top, right: node.right }}>
                <div className="w-24 h-24 rounded-[2rem] bg-inverse-surface/10 backdrop-blur-md border-4 border-surface-variant flex items-center justify-center shadow-xl relative">
                  <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>church</span>
                  <div className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-surface text-primary font-bold text-xs px-3 py-1 rounded-full border-2 border-surface-variant shadow-sm whitespace-nowrap">
                    {currentLocale === 'en' ? 'The Church' : 'الكنيسة'}
                  </div>
                </div>
              </div>
            );
          }

          const isCurrent = node.status === 'current';
          const isCompleted = node.status === 'completed';

          return (
            <div key={node.id} className="absolute z-30 flex items-center gap-3 flex-col md:flex-row" style={{ top: node.top, right: node.right }}>
              <div className="relative group cursor-pointer" onClick={() => setActiveNode(node.id)}>
                {isCurrent && (
                  <div className="absolute -inset-4 bg-amber-400/40 rounded-full blur-xl animate-pulse" />
                )}
                
                <button 
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-4 border-surface ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white shadow-[0px_8px_0px_0px_#005227] hover:scale-110' 
                      : isCurrent 
                      ? 'bg-amber-400 text-amber-950 shadow-[0px_8px_0px_0px_#d97706] scale-110 animate-bounce' 
                      : 'bg-slate-300 text-slate-500 shadow-[0px_6px_0px_0px_#94a3b8] opacity-70 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isCompleted ? 'check_circle' : isCurrent ? 'auto_stories' : 'lock'}
                  </span>
                </button>
              </div>

              {/* Tooltip / Details */}
              {(activeNode === node.id || isCurrent) && (
                <div className="glass-panel px-4 py-3 rounded-2xl shadow-lg flex flex-col border-2 border-primary/20 bg-surface/95 z-40 max-w-xs">
                  <span className="text-xs font-black text-primary mb-1">
                    {currentLocale === 'en' ? node.titleEn : node.titleAr}
                  </span>
                  <p className="text-xs text-outline font-medium">
                    {isCompleted 
                      ? (currentLocale === 'en' ? 'Completed & Rewarded' : 'تم القراءة والحصول على المكافأة') 
                      : isCurrent 
                      ? (currentLocale === 'en' ? 'Current Active Milestone' : 'المحطة النشطة اليوم') 
                      : (currentLocale === 'en' ? 'Complete previous day first' : 'أكمل قراءة اليوم السابق أولاً')}
                  </p>
                  {isCurrent && (
                    <Button size="sm" className="mt-2 text-xs font-bold rounded-xl shadow-md">
                      {currentLocale === 'en' ? 'Start Reading' : 'ابدأ القراءة الآن'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined">bookmark</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-base">
                  {currentLocale === 'en' ? 'Verses Mastered' : 'الآيات المحفوظة'}
                </h3>
              </div>
              <span className="text-xs font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">{masteredVerses}</span>
            </div>
            <ProgressBar value={memorizedVerses.length > 0 ? (masteredVerses / memorizedVerses.length) * 100 : 0} size="md" />
            <p className="text-xs text-on-surface-variant font-bold">
              {masteredVerses} / {memorizedVerses.length} {currentLocale === 'en' ? 'Verses 100% Mastered' : 'آية متقنة تماماً'}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <h3 className="font-extrabold text-on-surface text-base">
                  {currentLocale === 'en' ? 'Badges Earned' : 'الشارات المحصلة'}
                </h3>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">2 / 4</span>
            </div>
            <ProgressBar value={50} size="md" />
            <p className="text-xs text-on-surface-variant font-bold">
              2 / 4 {currentLocale === 'en' ? 'Badges Earned' : 'شارة محصلة'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
