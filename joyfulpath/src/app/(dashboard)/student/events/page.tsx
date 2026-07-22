'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, BadgeTag, Button } from '@/components/ui';
import { useUser } from '@/hooks/useUser';
import { MOCK_EVENTS } from '@/lib/supabase/mockClient';

// ── MOCK: events loaded from in-process constant ───────────────────────────
// REAL DB: const { data } = await supabase.from('events').select('*').order('date')

type EventType = 'camp' | 'service' | 'training' | 'ceremony' | 'other';

interface EventItem {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  time: string;
  end_time: string;
  location: string;
  max_capacity: number;
  current_rsvp: number;
  is_public: boolean;
}

const TYPE_STYLES: Record<EventType, { label: string; color: string; bg: string; icon: string }> = {
  camp:     { label: 'Camp',      color: 'text-emerald-700',  bg: 'bg-emerald-100',  icon: 'forest' },
  service:  { label: 'Service',   color: 'text-blue-700',     bg: 'bg-blue-100',     icon: 'church' },
  training: { label: 'Training',  color: 'text-purple-700',   bg: 'bg-purple-100',   icon: 'school' },
  ceremony: { label: 'Ceremony',  color: 'text-yellow-700',   bg: 'bg-yellow-100',   icon: 'military_tech' },
  other:    { label: 'Event',     color: 'text-gray-700',     bg: 'bg-gray-100',     icon: 'event' },
};

const FILTER_TYPES = ['all', 'camp', 'service', 'training', 'ceremony'] as const;

export default function EventsPage() {
  const { profile } = useUser();
  const userId = profile?.id ?? 'mock-student-id';

  // ── MOCK: pre-seed RSVPs from mockClient data ─────────────────────────────
  // REAL DB: fetch from event_registrations WHERE user_id = userId
  const [rsvped, setRsvped] = useState<Set<string>>(
    new Set(['event-1', 'event-2']) // mock defaults for student
  );
  const [loadingRsvp, setLoadingRsvp] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | EventType>('all');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load user's existing RSVPs from API
  useEffect(() => {
    fetch(`/api/events/rsvp?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRsvped(new Set(data.registeredEvents));
      })
      .catch(() => {}); // silently ignore in mock mode
  }, [userId]);

  const handleRsvp = useCallback(async (eventId: string) => {
    const isRegistered = rsvped.has(eventId);
    setLoadingRsvp(eventId);

    try {
      const res = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId,
          action: isRegistered ? 'cancel' : 'rsvp',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvped((prev) => {
          const next = new Set(prev);
          if (isRegistered) next.delete(eventId);
          else next.add(eventId);
          return next;
        });
      }
    } catch {
      // ignore network errors in mock mode
    } finally {
      setLoadingRsvp(null);
    }
  }, [rsvped, userId]);

  const filtered = (MOCK_EVENTS as EventItem[]).filter((e) => {
    const matchesType = filter === 'all' || e.type === filter;
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const canRsvp = profile?.role === 'student' || profile?.role === 'parent';

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            event
          </span>
          Upcoming Events
        </h1>
        <p className="text-sm text-on-surface-variant max-w-2xl">
          Browse all upcoming church activities, camp registrations, and special services.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search events or locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTER_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 capitalize ${
                filter === t
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/50 hover:text-on-surface'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <span className="material-symbols-outlined text-[48px] text-outline">event_busy</span>
          <p className="font-bold text-on-surface-variant">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
          {filtered.map((event) => {
            const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.other;
            const isRsvped = rsvped.has(event.id);
            const capacityPct = Math.min(100, Math.round((event.current_rsvp / event.max_capacity) * 100));
            const isFull = event.current_rsvp >= event.max_capacity;
            const eventDate = new Date(`${event.date}T${event.time}`);
            const isPast = mounted ? eventDate < new Date() : false;

            return (
              <Card
                key={event.id}
                className={`border bg-surface-container-lowest shadow-sm flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md ${
                  isRsvped ? 'border-primary/40' : 'border-outline-variant'
                }`}
              >
                {/* Colored top bar */}
                <div className={`h-1.5 ${isRsvped ? 'bg-primary' : style.bg.replace('bg-', 'bg-').replace('100', '300')}`} />

                <CardContent className="p-5 flex flex-col gap-4 flex-1">
                  {/* Type badge + RSVP status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.color}`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {style.icon}
                      </span>
                      {style.label}
                    </div>
                    {isRsvped && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-lg border border-success/30">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Registered
                      </div>
                    )}
                  </div>

                  {/* Title & description */}
                  <div className="space-y-1.5">
                    <h2 className="text-base font-extrabold text-on-surface leading-snug">{event.title}</h2>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{event.description}</p>
                  </div>

                  {/* Meta info */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[15px] text-primary">calendar_month</span>
                      {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{event.time} – {event.end_time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                      {event.location}
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/80">
                      <span>{event.current_rsvp} / {event.max_capacity} registered</span>
                      <span className={isFull ? 'text-error font-black' : capacityPct > 75 ? 'text-secondary' : 'text-success'}>
                        {isFull ? 'Full' : `${capacityPct}% filled`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? 'bg-error' : capacityPct > 75 ? 'bg-secondary' : 'bg-success'
                        }`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>

                  {/* RSVP button */}
                  {canRsvp && !isPast && (
                    <Button
                      variant={isRsvped ? 'outline' : isFull ? 'ghost' : 'primary'}
                      size="sm"
                      fullWidth
                      disabled={(!isRsvped && isFull) || loadingRsvp === event.id}
                      onClick={() => handleRsvp(event.id)}
                      className={isRsvped ? 'border-error text-error hover:bg-error/5' : ''}
                    >
                      {loadingRsvp === event.id ? (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                          Processing…
                        </span>
                      ) : isRsvped ? (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">event_busy</span>
                          Cancel Registration
                        </span>
                      ) : isFull ? (
                        'Event Full'
                      ) : (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                          Register for Event
                        </span>
                      )}
                    </Button>
                  )}
                  {isPast && (
                    <div className="text-center text-xs font-bold text-on-surface-variant/60 pt-1">
                      This event has passed
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
