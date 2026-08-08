'use client';

import { useState } from 'react';
import { Card, CardContent, Button, ProgressBar, PageTransition, HeroBanner } from '@/components/ui';

export default function StudentReadingPage() {
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(12);
  const [progress, setProgress] = useState(70);

  const handleComplete = () => {
    setCompleted(true);
    setStreak(s => s + 1);
    setProgress(p => Math.min(p + 5, 100));
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <HeroBanner
        title="Daily Bible Reading"
        subtitle="Nourish your spirit every day."
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_stories
          </span>
        }
      >
        <div className="absolute top-4 right-8 flex flex-col items-end">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <span className="font-bold">{streak} Day Streak</span>
          </div>
        </div>
      </HeroBanner>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-on-surface">Today&apos;s Reading</h2>
                <span className="text-sm font-bold text-on-surface-variant">Day 142</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-surface-container rounded-lg border-s-4 border-primary">
                  <h3 className="font-bold text-lg text-on-surface">Psalm 23</h3>
                  <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                    &ldquo;The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul...&rdquo;
                  </p>
                </div>

                <div className="p-4 bg-surface-container rounded-lg border-s-4 border-secondary">
                  <h3 className="font-bold text-lg text-on-surface">John 10:11-18</h3>
                  <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                    &ldquo;I am the good shepherd. The good shepherd lays down his life for the sheep...&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  variant={completed ? 'outline' : 'primary'} 
                  onClick={handleComplete}
                  disabled={completed}
                  size="lg"
                  icon={completed ? 'check' : 'done_all'}
                >
                  {completed ? 'Completed for Today' : 'Mark as Completed'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-on-surface">Overall Progress</h3>
              <ProgressBar value={progress} size="lg" />
              <p className="text-xs text-center text-on-surface-variant">You&apos;ve completed {progress}% of the 365-day plan.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
