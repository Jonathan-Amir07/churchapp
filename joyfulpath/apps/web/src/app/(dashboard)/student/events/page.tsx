'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';
import { useUser } from '@/hooks/useUser';
import { useNotificationStore } from '@/stores/notifications.store';
import { EventCard } from '@/components/domain/events/EventCard';

export default function StudentEventsPage() {
  const { profile } = useUser();
  const addToast = useNotificationStore(state => state.addToast);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const [eventsRes, rsvpRes] = await Promise.all([
          fetch('/api/events'),
          profile?.id ? fetch(`/api/events/rsvp?userId=${profile.id}`) : Promise.resolve(null)
        ]);

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(Array.isArray(data) ? data : data.data || []);
        }

        if (rsvpRes && rsvpRes.ok) {
          const rsvpData = await rsvpRes.json();
          setRegisteredEvents(rsvpData.registeredEvents || []);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }

    if (profile !== undefined) {
      loadEvents();
    }
  }, [profile]);

  const handleRSVP = async (eventId: string, isRegistered: boolean) => {
    if (!profile?.id) return;

    try {
      const action = isRegistered ? 'cancel' : 'rsvp';
      const res = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId: profile.id, action })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addToast(data.message || 'Success!', 'success');
        if (isRegistered) {
          setRegisteredEvents(prev => prev?.filter(id => id !== eventId));
        } else {
          setRegisteredEvents(prev => [...prev, eventId]);
        }
      } else {
        addToast(data.error || 'Failed to process RSVP', 'error');
      }
    } catch (err) {
      addToast('An error occurred', 'error');
    }
  };

  const typeColors: Record<string, string> = {
    social: 'bg-secondary/10 text-secondary',
    study: 'bg-primary/10 text-primary',
    service: 'bg-success/10 text-success',
  };

  return (
    <PageTransition className="space-y-6">
      <HeroBanner
        title="Events & Announcements"
        subtitle="Stay connected with your church family."
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            event
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-on-surface">Upcoming Events</h2>
          
          {loading ? (
             <div className="animate-pulse space-y-4">
               <div className="h-24 bg-surface-container rounded-xl" />
               <div className="h-24 bg-surface-container rounded-xl" />
             </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant font-medium">
              No upcoming events found.
            </div>
          ) : (
            <StaggerContainer className="space-y-4">
              {events?.map(ev => {
                const isRegistered = registeredEvents.includes(ev.id);
                return (
                  <StaggerItem key={ev.id}>
                    <EventCard 
                      event={ev} 
                      isRegistered={isRegistered} 
                      onAction={() => handleRSVP(ev.id, isRegistered)}
                      actionLabel={isRegistered ? 'Cancel RSVP' : 'RSVP Now'}
                      actionVariant={isRegistered ? 'outline' : 'primary'}
                    />
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface">Latest Announcements</h2>
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-card">
            <CardContent className="p-4 space-y-4">
              <div className="border-b border-outline-variant/50 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Sunday School Changes</h4>
                    <p className="text-[10px] text-on-surface-variant">By Admin • 2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">Please note that all classes will be moved to the new wing starting next week.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Choir Practice</h4>
                    <p className="text-[10px] text-on-surface-variant">By Instructor • 1 day ago</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">Reminder: Choir practice is at 5PM this Friday. Don't be late!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
