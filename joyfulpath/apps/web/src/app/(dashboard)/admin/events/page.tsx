'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, Button, BadgeTag, SearchBar } from '@/components/ui';
import { MOCK_EVENTS } from '@/lib/supabase/mockClient';
import { useTranslations } from 'next-intl';
import { useNotificationStore } from '@/stores/notifications.store';

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

const EMPTY_FORM: Omit<EventItem, 'id' | 'current_rsvp'> = {
  title: '',
  description: '',
  type: 'service',
  date: '',
  time: '10:00',
  end_time: '12:00',
  location: '',
  max_capacity: 50,
  is_public: true,
};

const TYPE_COLORS: Record<EventType, string> = {
  camp:     'bg-emerald-100 text-emerald-700',
  service:  'bg-blue-100 text-blue-700',
  training: 'bg-purple-100 text-purple-700',
  ceremony: 'bg-yellow-100 text-yellow-700',
  other:    'bg-gray-100 text-gray-700',
};

export default function AdminEventsPage() {
  const tCommon = useTranslations('common');
  const tEvents = useTranslations('events');
  const addToast = useNotificationStore((s: any) => s.addToast);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS as EventItem[]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<EventItem, 'id' | 'current_rsvp'>>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openCreate = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((event: EventItem) => {
    setForm({
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.date,
      time: event.time,
      end_time: event.end_time,
      location: event.location,
      max_capacity: event.max_capacity,
      is_public: event.is_public,
    });
    setEditingId(event.id);
    setShowForm(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.title.trim() || !form.date || !form.location.trim()) {
      showToast('Please fill in title, date, and location.', 'error');
      return;
    }

    if (editingId) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form } : e))
      );
      showToast('Event updated successfully!');
    } else {
      const newEvent: EventItem = {
        ...form,
        id: `event-${Date.now()}`,
        current_rsvp: 0,
      };
      setEvents((prev) => [newEvent, ...prev]);
      showToast('Event created successfully!');
    }

    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, showToast]);

  const handleDelete = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
    showToast('Event deleted.');
  }, [showToast]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
            toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{tEvents('title')}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{tEvents('description')}</p>
        </div>
        <Button variant="primary" onClick={openCreate} className="gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          {tEvents('createNew')}
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search events by title, description, location, or type..."
        resultCount={filteredEvents.length}
        totalCount={events.length}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Events',      value: events.length,                                          icon: 'event',        color: 'text-primary bg-primary/10' },
          { label: 'Public Events',     value: events.filter((e) => e.is_public).length,               icon: 'public',       color: 'text-success bg-success/10' },
          { label: 'Total Capacity',    value: events.reduce((s, e) => s + e.max_capacity, 0),          icon: 'group',        color: 'text-secondary bg-secondary/10' },
          { label: 'Total Registered',  value: events.reduce((s, e) => s + e.current_rsvp, 0),          icon: 'how_to_reg',   color: 'text-tertiary bg-tertiary/10' },
        ].map(({ label, value, icon, color }) => (
          <Card key={label} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-on-surface">{value}</p>
                <p className="text-[10px] uppercase font-black text-on-surface-variant/70 tracking-wider">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events Table */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 text-xs uppercase font-black text-outline">
                  <th className="px-5 py-4 text-start">{tEvents('event')}</th>
                  <th className="px-5 py-4 text-start">{tEvents('type')}</th>
                  <th className="px-5 py-4 text-start">{tEvents('date')}</th>
                  <th className="px-5 py-4 text-start">{tEvents('location')}</th>
                  <th className="px-5 py-4 text-center">{tEvents('rsvp')}</th>
                  <th className="px-5 py-4 text-center">{tEvents('visibility')}</th>
                  <th className="px-5 py-4 text-end">{tEvents('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredEvents.map((event) => {
                  const capacityPct = Math.round((event.current_rsvp / event.max_capacity) * 100);
                  const isFull = event.current_rsvp >= event.max_capacity;
                  return (
                    <tr key={event.id} className="hover:bg-surface-container-low/40 transition duration-150">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-extrabold text-on-surface">{event.title}</p>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">{event.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${TYPE_COLORS[event.type]}`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-on-surface text-xs">
                          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">{event.time} – {event.end_time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-on-surface-variant">{event.location}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="space-y-1">
                          <p className={`text-xs font-extrabold ${isFull ? 'text-error' : 'text-on-surface'}`}>
                            {event.current_rsvp}/{event.max_capacity}
                          </p>
                          <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden mx-auto">
                            <div
                              className={`h-full rounded-full ${isFull ? 'bg-error' : capacityPct > 75 ? 'bg-secondary' : 'bg-success'}`}
                              style={{ width: `${capacityPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <BadgeTag variant={event.is_public ? 'success' : 'outline'}>
                          {event.is_public ? 'Public' : 'Internal'}
                        </BadgeTag>
                      </td>
                      <td className="px-5 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(event)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(event.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-outline-variant overflow-hidden">
            <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">
                {editingId ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Event title"
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('descriptionLabel')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the event"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Type + Visibility row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('type')}</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EventType }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="camp">{tEvents('camp')}</option>
                    <option value="service">{tEvents('service')}</option>
                    <option value="training">{tEvents('training')}</option>
                    <option value="ceremony">{tEvents('ceremony')}</option>
                    <option value="other">{tEvents('other')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('visibility')}</label>
                  <select
                    value={form.is_public ? 'public' : 'internal'}
                    onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.value === 'public' }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="public">{tEvents('public')}</option>
                    <option value="internal">{tEvents('internalOnly')}</option>
                  </select>
                </div>
              </div>

              {/* Date + Times */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('start')}</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('end')}</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Main Cathedral Hall"
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>

              {/* Max Capacity */}
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">{tEvents('maxCapacity')}</label>
                <input
                  type="number"
                  min={1}
                  value={form.max_capacity}
                  onChange={(e) => setForm((f) => ({ ...f, max_capacity: parseInt(e.target.value) || 1 }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowForm(false)}>{tCommon('cancel')}</Button>
              <Button variant="primary" onClick={handleSave}>
                {editingId ? tCommon('save') : tEvents('createNew')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface rounded-3xl shadow-2xl border border-outline-variant p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                  delete_forever
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-on-surface">Delete Event?</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  This will permanently remove the event and all its registrations.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" fullWidth onClick={() => setDeleteConfirm(null)}>{tCommon('cancel')}</Button>
              <Button variant="primary" fullWidth onClick={() => handleDelete(deleteConfirm)}
                className="bg-error hover:bg-error/90 text-white">
                {tCommon('delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
