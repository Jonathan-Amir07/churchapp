'use client';

import { Card, CardContent, Button, PageTransition, StaggerContainer, StaggerItem } from '@/components/ui';

export default function InstructorPrayerRequestsPage() {
  const requests = [
    { id: '1', studentName: 'John Doe', request: 'Please pray for my grandfather who is in the hospital.', isPrivate: false, isAnswered: false },
    { id: '2', studentName: 'Jane Smith', request: 'Pray for my upcoming exams this week.', isPrivate: true, isAnswered: true }
  ];

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
        Class Prayer Requests
      </h1>

      <StaggerContainer className="space-y-4">
        {requests.map(req => (
          <StaggerItem key={req.id}>
            <Card className={`border ${req.isAnswered ? 'border-success/30 bg-success/5' : 'border-outline-variant bg-surface-container-lowest'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{req.studentName}</span>
                    {req.isPrivate && <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded uppercase">Private</span>}
                  </div>
                  {req.isAnswered ? (
                    <span className="text-xs font-bold text-success flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Answered
                    </span>
                  ) : (
                    <Button variant="ghost" size="sm">Mark Answered</Button>
                  )}
                </div>
                <p className="text-on-surface text-sm italic">&ldquo;{req.request}&rdquo;</p>
                
                {!req.isAnswered && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/50">
                    <textarea rows={2} className="w-full p-2 border border-outline-variant rounded text-sm bg-surface text-on-surface mb-2" placeholder="Write a response or encouragement..." />
                    <Button variant="primary" size="sm" icon="send">Send Reply</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
