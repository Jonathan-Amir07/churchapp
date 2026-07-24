'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Input } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function InstructorPrayers() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { prayers, respondPrayer, markPrayedFor } = useAppStore();
  const addToast = useNotificationStore(s => s.addToast);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'private'>('all');
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  // Filter logic
  const filteredPrayers = prayers.filter((p) => {
    if (activeTab === 'pending') return !p.response;
    if (activeTab === 'private') return p.isPrivate;
    return true;
  });

  const handleResponseSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = responseTexts[id];
    if (!text?.trim()) return;

    respondPrayer(id, text);
    
    // Clear form state
    setResponseTexts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    addToast('Response submitted successfully!', 'success');
  };

  const handleTextChange = (id: string, value: string) => {
    setResponseTexts((prev) => ({ ...prev, [id]: value }));
  };

  const handleMarkPrayed = (id: string) => {
    markPrayedFor(id);
    addToast('Request marked as prayed for!', 'success');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('prayers')}
        </h1>
        <p className="text-on-surface-variant text-sm">
          Respond to student prayers, write words of encouragement, and mark requests as prayed for.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          All Requests ({prayers.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Pending Reply ({prayers.filter((p) => !p.response).length})
        </button>
        <button
          onClick={() => setActiveTab('private')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'private'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Private Requests ({prayers.filter((p) => p.isPrivate).length})
        </button>
      </div>

      {/* Requests Queue */}
      <div className="space-y-4 max-w-3xl">
        {filteredPrayers.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">check_circle</span>
            <p className="text-sm font-bold text-on-surface-variant">All caught up! No requests match this category.</p>
          </div>
        ) : (
          filteredPrayers.map((p) => (
            <Card key={p.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      p.type === 'prayer' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                    }`}>
                      {p.studentName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                        {p.studentName}
                        {p.isPrivate && (
                          <span className="bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                            Private
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    p.type === 'prayer'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {p.type === 'prayer' ? 'Prayer Request' : 'Thanksgiving'}
                  </span>
                </div>

                <p className="text-sm text-on-surface font-medium leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40">
                  {p.content}
                </p>

                {/* Existing Reply */}
                {p.response ? (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span className="text-xs font-black">Your Response ({new Date(p.respondedAt || '').toLocaleDateString()}):</span>
                    </div>
                    <p className="text-xs font-bold text-on-surface leading-relaxed">
                      {p.response}
                    </p>
                  </div>
                ) : (
                  // Reply Form
                  <form onSubmit={(e) => handleResponseSubmit(p.id, e)} className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider">Write Encouragement</label>
                      <Input
                        required
                        value={responseTexts[p.id] || ''}
                        onChange={(e) => handleTextChange(p.id, e.target.value)}
                        placeholder="Type standard reply (e.g. Praying for you, God bless)..."
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="primary" size="sm" type="submit" className="text-xs h-9 px-4">
                        Submit Response
                      </Button>
                    </div>
                  </form>
                )}

                {/* Prayed Check */}
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
                  <span className="text-[11px] font-extrabold text-outline">
                    Encouraged by {p.prayedCount} student(s)
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {!p.isPrayedFor ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMarkPrayed(p.id)}
                        className="text-xs h-8 px-3 border-outline-variant/60"
                        icon="check_circle"
                        iconPosition="start"
                      >
                        Mark Prayed For
                      </Button>
                    ) : (
                      <span className="text-xs text-success font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Prayed For
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
