'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';
import { useUser } from '@/hooks/useUser';
import { useNotificationStore } from '@/stores/notifications.store';

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
          setEvents(await eventsRes.json());
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
          setRegisteredEvents(prev => prev.filter(id => id !== eventId));
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
              {events.map(ev => {
                const dateParts = new Date(ev.date).toDateString().split(' ');
                const isRegistered = registeredEvents.includes(ev.id);
                
                return (
                  <StaggerItem key={ev.id}>
                    <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest">
                      <CardContent className="p-0 flex">
                        <div className="bg-primary/10 text-primary w-24 flex flex-col items-center justify-center p-4 border-e border-outline-variant/50">
                          <span className="text-xs font-bold uppercase">{dateParts[1]}</span>
                          <span className="text-2xl font-black">{dateParts[2]}</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-on-surface">{ev.title}</h3>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${typeColors[ev.type] || 'bg-surface-container text-on-surface-variant'}`}>
                                {ev.type}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm text-on-surface-variant">
                              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {ev.time}</span>
                              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {ev.location}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                             <Button 
                               variant={isRegistered ? "outline" : "primary"} 
                               size="sm" 
                               onClick={() => handleRSVP(ev.id, isRegistered)}
                             >
                               {isRegistered ? 'Cancel RSVP' : 'RSVP Now'}
                             </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface">Latest Announcements</h2>
          <Card className="border border-outline-variant bg-surface-container-lowest">
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
