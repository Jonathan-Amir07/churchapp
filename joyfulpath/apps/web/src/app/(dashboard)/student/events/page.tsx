'use client';

import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';
import Link from 'next/link';

export default function StudentEventsPage() {
  const events = [
    { id: '1', title: 'Youth Group Bonfire', date: 'Oct 25, 2026', time: '7:00 PM', location: 'Church Backyard', type: 'social' },
    { id: '2', title: 'Bible Study', date: 'Oct 28, 2026', time: '6:30 PM', location: 'Room 104', type: 'study' },
    { id: '3', title: 'Community Service', date: 'Nov 2, 2026', time: '9:00 AM', location: 'Downtown Shelter', type: 'service' }
  ];

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
          <StaggerContainer className="space-y-4">
            {events.map(ev => (
              <StaggerItem key={ev.id}>
                <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest">
                  <CardContent className="p-0 flex">
                    <div className="bg-primary/10 text-primary w-24 flex flex-col items-center justify-center p-4 border-e border-outline-variant/50">
                      <span className="text-xs font-bold uppercase">{ev.date.split(' ')[0]}</span>
                      <span className="text-2xl font-black">{ev.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-on-surface">{ev.title}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${typeColors[ev.type] || 'bg-surface-container text-on-surface-variant'}`}>
                          {ev.type}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {ev.time}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {ev.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
