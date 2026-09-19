'use client';

import { PageTransition } from '@/components/ui';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';

export default function EventsPage() {
  const { data: events, isLoading } = useSWR('/events', (url) => apiClient.get(url));

  return (
    <PageTransition className="space-y-6 animate-[slide-up_0.4s_ease-out] pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">الفعاليات</h1>
          <p className="font-body-md text-on-surface-variant mt-2 text-lg">الأنشطة والفعاليات القادمة في الكنيسة.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event: any) => (
            <div key={event.id} className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary-container text-on-primary-container">
                  <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                  <span className="text-xs mt-1">{new Date(event.date).toLocaleDateString('ar-EG', { month: 'short' })}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container">{event.type}</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-1">{event.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">{event.description}</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-outline-variant/50">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{event.time} {event.endTime ? `- ${event.endTime}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 text-outline opacity-50">event_busy</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد فعاليات</h3>
          <p>لا توجد فعاليات قادمة في الوقت الحالي.</p>
        </div>
      )}
    </PageTransition>
  );
}
