'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';

export default function StudentPrayers() {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  
  const { prayers, addPrayer, amenPrayer, points, addPoints, xp, addXP } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'prayer' | 'thanksgiving'>('prayer');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter lists
  const publicPrayers = prayers.filter((p) => !p.isPrivate);
  const myPrayers = prayers.filter((p) => p.studentName === 'Jonathan'); // Jonathan is the mock student user

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      addPrayer(type, content, isPrivate, 'Jonathan');
      
      // Award XP for submitting a prayer (Phase 2 community engagement reward)
      addXP(10);
      addPoints(2);
      
      setContent('');
      setIsPrivate(false);
      setIsSubmitting(false);
    }, 400);
  };

  const handleAmen = (id: string) => {
    amenPrayer(id);
    // Reward student with 1 point for encouraging others (Prayer Warrior track!)
    addPoints(1);
    addXP(2);
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('prayers')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            Submit prayer requests, thank God for blessings, and pray for your brothers and sisters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Submit Form (Left/Top) */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_circle</span>
              New Request
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('prayer')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      type === 'prayer'
                        ? 'bg-primary border-primary text-on-primary shadow-sm'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Prayer Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('thanksgiving')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      type === 'thanksgiving'
                        ? 'bg-success border-success text-on-success shadow-sm'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Thanksgiving
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'prayer' ? 'What should we pray for?' : 'What are you thankful for?'}
                  className="w-full text-sm p-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Private Request</span>
                  <span className="text-[10px] text-on-surface-variant">Only visible to you and instructors</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                size="md"
                type="submit"
                disabled={isSubmitting}
                icon="send"
                iconPosition="end"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Requests List (Right/Bottom) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Selector */}
          <div className="flex border-b border-outline-variant">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
              All Prayers ({publicPrayers.length})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'my'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              My Requests ({myPrayers.length})
            </button>
          </div>

          {/* List display */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {(activeTab === 'all' ? publicPrayers : myPrayers).length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">sentiment_satisfied</span>
                <p className="text-sm font-bold text-on-surface-variant">No request matching this category yet.</p>
              </div>
            ) : (
              (activeTab === 'all' ? publicPrayers : myPrayers).map((p) => (
                <Card key={p.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          p.type === 'prayer' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                          {p.studentName[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-on-surface">
                            {p.studentName} {p.isPrivate && <span className="text-[10px] bg-outline-variant text-outline px-1.5 py-0.5 rounded ml-1 font-normal">Private</span>}
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

                    {/* Instructor Response */}
                    {p.response && (
                      <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/20 space-y-2">
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[16px]">reply</span>
                          <span className="text-xs font-black">Servant Response</span>
                        </div>
                        <p className="text-xs font-bold text-on-surface leading-relaxed">
                          {p.response}
                        </p>
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/40">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAmen(p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-primary hover:bg-primary/5 border border-primary/10 transition-all select-none"
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            favorite
                          </span>
                          Amen ({p.prayedCount})
                        </button>
                      </div>
                      
                      {p.isPrayedFor ? (
                        <div className="flex items-center gap-1 text-success text-xs font-extrabold select-none">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Prayed For
                        </div>
                      ) : (
                        <span className="text-[11px] text-outline font-black">Pending Response</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
