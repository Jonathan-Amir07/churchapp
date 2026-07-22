'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default function AdminContentManagement() {
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-2xl select-none border border-secondary/30">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-white">library_books</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Content Management
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            Manage Coptic calendar events, saints, Synaxarium readings, and daily verses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-purple-600">auto_stories</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Synaxarium & Saints</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Add daily readings and update the saints library.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Manage Saints
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-sky-600">calendar_month</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Coptic Calendar</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Configure Feasts and Fasts dates for the current year.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Manage Calendar
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-green-600">menu_book</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Daily Gospel & Verse</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Set up the daily spiritual readings and verses for the app dashboard.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Manage Readings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
