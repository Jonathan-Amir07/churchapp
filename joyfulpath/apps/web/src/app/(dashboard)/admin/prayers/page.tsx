'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Input, SearchBar } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function InstructorPrayers() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { prayers, respondPrayer, markPrayedFor } = useAppStore();
  const addToast = useNotificationStore(s => s.addToast);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'private'>('all');
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter logic
  const filteredPrayers = useMemo(() => {
    return prayers.filter((p) => {
      if (activeTab === 'pending' && p.response) return false;
      if (activeTab === 'private' && !p.isPrivate) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.studentName.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prayers, activeTab, searchQuery]);

  const handleResponseSubmit = useCallback((id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = responseTexts[id];
    if (!text?.trim()) return;

    respondPrayer(id, text);
    setResponseTexts((prev) => ({ ...prev, [id]: '' }));
    addToast('Response sent successfully!', 'success');
  }, [responseTexts, respondPrayer, addToast]);

  const handleTextChange = useCallback((id: string, text: string) => {
    setResponseTexts((prev) => ({ ...prev, [id]: text }));
  }, []);

  const handleMarkPrayed = useCallback((id: string) => {
    markPrayedFor(id);
    addToast('Marked as prayed for!', 'success');
  }, [markPrayedFor, addToast]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('prayers')}
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Review student prayer requests, send encouraging words, and keep track of answered prayers.
        </p>
      </div>

      {/* Search Bar & Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/50 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            All Prayers
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Pending Response
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'private'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Private Requests
          </button>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by student name or prayer content..."
          resultCount={filteredPrayers.length}
          totalCount={prayers.length}
          className="w-full sm:w-80"
        />
      </div>

      {/* Prayer List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPrayers.map((prayer) => (
          <Card key={prayer.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {prayer.studentName[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-on-surface">
                      {prayer.studentName}
                    </CardTitle>
                    <p className="text-xs text-outline">{prayer.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {prayer.isPrivate && (
                    <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                      Private
                    </span>
                  )}
                  {prayer.prayedCount > 0 && (
                    <span className="text-[10px] font-black bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                      Prayed for ({prayer.prayedCount})
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-on-surface font-medium leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
                {prayer.content}
              </p>

              {/* Response Section */}
              {prayer.response ? (
                <div className="space-y-1.5 pl-4 border-l-2 border-primary">
                  <p className="text-xs font-bold text-primary">Servant Response:</p>
                  <p className="text-xs text-on-surface-variant italic">{prayer.response}</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleResponseSubmit(prayer.id, e)} className="space-y-3 pt-2">
                  <Input
                    placeholder="Write an encouraging response..."
                    value={responseTexts[prayer.id] || ''}
                    onChange={(e) => handleTextChange(prayer.id, e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkPrayed(prayer.id)}
                    >
                      Mark as Prayed
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Send Response
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredPrayers.length === 0 && (
          <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">volunteer_activism</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">No prayer requests match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
