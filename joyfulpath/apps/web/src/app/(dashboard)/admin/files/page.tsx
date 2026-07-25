'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, BadgeTag } from '@/components/ui';

export default function AdminFileManager() {
  const tCommon = useTranslations('common');
  const tFiles = useTranslations('files');
  const [activeTab, setActiveTab] = useState<'images' | 'documents' | 'videos'>('images');

  const files = [
    { name: 'church_logo.png', type: 'images', size: '2.4 MB', date: '2026-07-10' },
    { name: 'summer_camp_flyer.pdf', type: 'documents', size: '5.1 MB', date: '2026-07-12' },
    { name: 'bible_lesson_1.mp4', type: 'videos', size: '124 MB', date: '2026-07-15' },
    { name: 'saint_mark.jpg', type: 'images', size: '1.2 MB', date: '2026-07-16' },
  ];

  const filtered = files.filter(f => f.type === activeTab);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{tFiles('title')}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{tFiles('description')}</p>
        </div>
        <Button variant="primary" icon="upload">{tFiles('uploadFile')}</Button>
      </div>

      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('images')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'images' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">image</span> {tFiles('images')}
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'documents' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">description</span> {tFiles('documents')}
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">movie</span> {tFiles('videos')}
        </button>
      </div>

      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/60">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">{tFiles('noFiles')}</div>
            ) : (
              filtered.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        {file.type === 'images' ? 'image' : file.type === 'videos' ? 'movie' : 'description'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon="download">{tFiles('download')}</Button>
                    <Button variant="danger" size="sm" icon="delete">{tCommon('delete')}</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
