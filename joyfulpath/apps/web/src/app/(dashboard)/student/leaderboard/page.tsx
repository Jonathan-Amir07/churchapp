'use client';

import { Card, CardContent, PageTransition } from '@/components/ui';

export default function StudentLeaderboardPage() {
  const students = [
    { rank: 1, name: 'Jane Smith', xp: 4200, level: 12, isMe: false },
    { rank: 2, name: 'You', xp: 3950, level: 11, isMe: true },
    { rank: 3, name: 'Michael Johnson', xp: 3800, level: 11, isMe: false },
    { rank: 4, name: 'Emily Davis', xp: 3500, level: 10, isMe: false },
    { rank: 5, name: 'Chris Wilson', xp: 3200, level: 9, isMe: false }
  ];

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 glow-gold">
          <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>social_leaderboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface">Class Leaderboard</h1>
        <p className="text-on-surface-variant">See how you rank among your peers!</p>
      </div>

      <Card className="border border-outline-variant bg-surface-container-lowest shadow-xl">
        <CardContent className="p-0">
          <div className="bg-surface-container py-4 px-6 border-b border-outline-variant flex justify-between font-bold text-sm text-on-surface-variant uppercase tracking-wider">
            <span className="w-16 text-center">Rank</span>
            <span className="flex-1">Student</span>
            <span className="w-32 text-end">XP & Level</span>
          </div>

          <div className="divide-y divide-outline-variant/50">
            {students.map(s => (
              <div key={s.rank} className={`flex justify-between items-center py-4 px-6 transition stagger-item ${s.isMe ? 'bg-primary/5' : 'hover:bg-surface-container/30'}`}>
                <div className="w-16 flex justify-center">
                  {s.rank <= 3 ? (
                    <span className={`material-symbols-outlined text-[32px] ${s.rank === 1 ? 'text-secondary glow-gold' : s.rank === 2 ? 'text-outline' : 'text-tertiary'}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      emoji_events
                    </span>
                  ) : (
                    <span className="font-black text-xl text-on-surface-variant">{s.rank}</span>
                  )}
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <span className={`font-bold text-lg ${s.isMe ? 'text-primary' : 'text-on-surface'}`}>{s.name}</span>
                </div>

                <div className="w-32 text-end">
                  <p className="font-black text-lg text-on-surface">{s.xp.toLocaleString()}</p>
                  <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded uppercase">Level {s.level}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
