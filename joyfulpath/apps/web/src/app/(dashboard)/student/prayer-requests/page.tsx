'use client';

import { useState } from 'react';
import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';

export default function StudentPrayerRequestsPage() {
  const [requestText, setRequestText] = useState('');

  const requests = [
    { id: '1', request: 'Please pray for my grandfather who is in the hospital.', isPrivate: false, isAnswered: false, date: 'Oct 20, 2026' },
    { id: '2', request: 'Pray for my upcoming exams this week.', isPrivate: true, isAnswered: true, date: 'Oct 15, 2026' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestText('');
  };

  return (
    <PageTransition className="space-y-6">
      <HeroBanner
        title="Prayer Requests"
        subtitle="Share your burdens with your church family."
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            volunteer_activism
          </span>
        }
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StaggerItem>
          <Card className="border border-outline-variant bg-surface-container-lowest h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-on-surface mb-4">Submit a Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                  required
                  rows={5} 
                  value={requestText}
                  onChange={e => setRequestText(e.target.value)}
                  className="w-full p-4 border border-outline-variant rounded-xl bg-surface focus:border-primary text-on-surface" 
                  placeholder="What can we pray for?" 
                />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="private" className="w-4 h-4 text-primary accent-primary" />
                  <label htmlFor="private" className="text-sm text-on-surface-variant">Keep this request private (only seen by teachers)</label>
                </div>
                <Button fullWidth variant="primary" type="submit">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-on-surface">My Requests</h2>
            {requests.map(req => (
              <Card key={req.id} className="border border-outline-variant bg-surface-container-lowest">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-on-surface-variant font-bold">{req.date}</span>
                    <div className="flex gap-2">
                      {req.isPrivate && <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded uppercase">Private</span>}
                      {req.isAnswered && (
                        <span className="text-xs font-bold text-success flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Answered
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface italic">&ldquo;{req.request}&rdquo;</p>
                  
                  {req.isAnswered && (
                    <div className="mt-4 pt-3 border-t border-outline-variant/50">
                      <p className="text-xs font-bold text-primary mb-1">Teacher&apos;s Response:</p>
                      <p className="text-sm text-on-surface-variant bg-surface-container p-2 rounded">
                        &ldquo;We are praying with you, keep faith!&rdquo;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
