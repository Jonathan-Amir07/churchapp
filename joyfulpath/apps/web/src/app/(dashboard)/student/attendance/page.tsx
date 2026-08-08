'use client';

import { useState } from 'react';
import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';

export default function StudentAttendancePage() {
  const [token, setToken] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckedIn(true);
  };

  return (
    <PageTransition className="space-y-6">
      <HeroBanner
        title="Class Check-in"
        subtitle="Mark your attendance and earn XP!"
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            fact_check
          </span>
        }
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm h-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-[48px]">qr_code_scanner</span>
              </div>
              
              {!checkedIn ? (
                <form onSubmit={handleCheckIn} className="space-y-4">
                  <h3 className="font-bold text-on-surface">Enter Class Code</h3>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. A7B2" 
                    value={token}
                    onChange={e => setToken(e.target.value.toUpperCase())}
                    className="w-full text-center text-2xl font-black tracking-widest p-4 border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-0 uppercase bg-surface text-on-surface"
                    maxLength={6}
                  />
                  <Button fullWidth variant="primary" type="submit" size="lg">Check In</Button>
                </form>
              ) : (
                <div className="space-y-2 animate-[celebrate_0.6s_ease-out]">
                  <h3 className="font-bold text-success text-xl flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Checked In!
                  </h3>
                  <p className="text-sm text-on-surface-variant">You've successfully marked your attendance for today.</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-secondary/10 text-secondary font-bold px-4 py-2 rounded-full text-sm glow-gold">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    +20 XP Earned!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm h-full">
            <CardContent className="p-6">
              <h3 className="font-bold text-on-surface mb-4">Recent Attendance</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-3 border border-outline-variant/50 rounded-lg bg-surface-container/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 text-success rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">Sunday School Class</p>
                        <p className="text-xs text-on-surface-variant">Oct {14 - i}, 2026</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-secondary glow-gold">+20 XP</span>
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
