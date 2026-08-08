'use client';

import { Card, CardContent, PageTransition, StatCard, StaggerContainer, StaggerItem } from '@/components/ui';

export default function InstructorAnalyticsPage() {
  return (
    <PageTransition className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
        Class Analytics
      </h1>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StaggerItem>
          <StatCard icon="groups" label="Total Students" value={24} iconColor="text-primary bg-primary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="event_available" label="Avg Attendance" value="92%" iconColor="text-success bg-success/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="quiz" label="Avg Quiz Score" value="88%" iconColor="text-secondary bg-secondary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="stars" label="Total XP Awarded" value="12,450" iconColor="text-warning bg-warning/10" trend={{ value: '+8% this month', positive: true }} />
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">Attendance Over Time</h2>
              <div className="h-64 bg-surface-container rounded-xl flex items-center justify-center border border-dashed border-outline-variant">
                <div className="text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] opacity-40">bar_chart</span>
                  <p className="text-sm mt-2">Chart integration pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">Top Performing Students</h2>
              <div className="space-y-3">
                {[
                  { name: 'John Doe', xp: 4500, score: '98%' },
                  { name: 'Jane Smith', xp: 4200, score: '95%' },
                  { name: 'Michael Johnson', xp: 3950, score: '92%' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border border-outline-variant rounded-lg stagger-item">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black">{i + 1}</div>
                      <span className="font-bold text-on-surface">{s.name}</span>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-bold text-success">{s.score}</p>
                      <p className="text-xs text-on-surface-variant">{s.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
