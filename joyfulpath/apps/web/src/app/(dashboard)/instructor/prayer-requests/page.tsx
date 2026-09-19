'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, PageTransition, StaggerContainer, StaggerItem } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function InstructorPrayerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const addToast = useNotificationStore(s => s.addToast);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/prayer-requests');
      if (res.ok) {
        setRequests(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleMarkAnswered = async (id: string) => {
    try {
      const res = await fetch(`/api/prayer-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAddressed: true })
      });
      if (res.ok) {
        addToast('Marked as answered', 'success');
        fetchRequests();
      } else {
        addToast('Failed to mark as answered', 'error');
      }
    } catch (e) {
      addToast('Error occurred', 'error');
    }
  };

  const handleSendReply = async (id: string) => {
    const responseText = responses[id];
    if (!responseText?.trim()) return;

    try {
      const res = await fetch(`/api/prayer-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAddressed: true, response: responseText })
      });
      if (res.ok) {
        addToast('Reply sent successfully', 'success');
        setResponses(prev => ({ ...prev, [id]: '' }));
        fetchRequests();
      } else {
        addToast('Failed to send reply', 'error');
      }
    } catch (e) {
      addToast('Error occurred', 'error');
    }
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
        Class Prayer Requests
      </h1>

      <StaggerContainer className="space-y-4">
        {requests?.map(req => (
          <StaggerItem key={req.id}>
            <Card className={`border ${req.isAddressed ? 'border-success/30 bg-success/5' : 'border-outline-variant bg-surface-container-lowest'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{req.student?.firstName} {req.student?.lastName}</span>
                    {req.isPrivate && <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded uppercase">Private</span>}
                  </div>
                  {req.isAddressed ? (
                    <span className="text-xs font-bold text-success flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Answered
                    </span>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAnswered(req.id)}>Mark Answered</Button>
                  )}
                </div>
                <p className="text-on-surface text-sm italic">&ldquo;{req.body}&rdquo;</p>
                
                {!req.isAddressed && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/50">
                    <textarea 
                      rows={2} 
                      className="w-full p-2 border border-outline-variant rounded text-sm bg-surface text-on-surface mb-2" 
                      placeholder="Write a response or encouragement..."
                      value={responses[req.id] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [req.id]: e.target.value }))}
                    />
                    <Button variant="primary" size="sm" icon="send" onClick={() => handleSendReply(req.id)}>Send Reply</Button>
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
