'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default function AdminContentManagement() {
  const tCommon = useTranslations('common');
  
  const [showReadingPlans, setShowReadingPlans] = useState(false);
  const [readingPlans, setReadingPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ title: '', durationDays: 30 });

  const fetchReadingPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/reading-plans');
      if (res.ok) {
        setReadingPlans(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchReadingPlans();
  }, [fetchReadingPlans]);

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

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-green-600">menu_book</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Reading Plans</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Set up the reading plans and content duration.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md" onClick={() => setShowReadingPlans(true)}>
              Manage Reading Plans
            </Button>
          </div>
        </Card>
      </div>

      {showReadingPlans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">Reading Plans</h2>
              <button
                onClick={() => setShowReadingPlans(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {readingPlans.map(plan => (
                <div key={plan.id} className="flex justify-between items-center p-4 border border-outline-variant rounded-xl">
                  <div>
                    <h3 className="font-bold">{plan.title}</h3>
                    <p className="text-sm text-on-surface-variant">{plan.durationDays} Days</p>
                  </div>
                  <Button variant="ghost" className="text-error" onClick={async () => {
                    await fetch(`/api/reading-plans/${plan.id}`, { method: 'DELETE' });
                    fetchReadingPlans();
                  }}>Delete</Button>
                </div>
              ))}

              <div className="pt-4 border-t border-outline-variant mt-4 space-y-3">
                <h3 className="font-bold">Create New</h3>
                <input 
                  type="text" 
                  placeholder="Plan Title" 
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant"
                  value={newPlan.title}
                  onChange={e => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                />
                <input 
                  type="number" 
                  placeholder="Duration (Days)" 
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant"
                  value={newPlan.durationDays}
                  onChange={e => setNewPlan(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 30 }))}
                />
                <Button variant="primary" onClick={async () => {
                  if (!newPlan.title) return;
                  await fetch('/api/reading-plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPlan)
                  });
                  setNewPlan({ title: '', durationDays: 30 });
                  fetchReadingPlans();
                }}>
                  Add Reading Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
