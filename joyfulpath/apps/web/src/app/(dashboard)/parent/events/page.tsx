'use client';

import { PageTransition } from '@/components/ui';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import { EventCard } from '@/components/domain/events/EventCard';

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
            <EventCard key={event.id} event={event} locale="ar" />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 text-outline opacity-50">event_busy</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد فعاليات</h3>
          <p>لا توجد فعاليات قادمة في الوقت الحالي.</p>
        </div>
      )}
    </PageTransition>
  );
}
