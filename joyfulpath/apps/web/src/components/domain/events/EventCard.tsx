import React from 'react';
import { Card, CardContent, Button } from '@/components/ui';

export interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  time: string;
  endTime?: string;
  location: string;
  type: string;
}

interface EventCardProps {
  event: ChurchEvent;
  isRegistered?: boolean;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'outline' | 'secondary' | 'danger';
  locale?: string;
}

export function EventCard({
  event,
  isRegistered,
  onAction,
  actionLabel,
  actionVariant = 'primary',
  locale = 'en'
}: EventCardProps) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const monthStr = dateObj.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' });

  const typeColors: Record<string, string> = {
    social: 'bg-secondary/10 text-secondary',
    study: 'bg-primary/10 text-primary',
    service: 'bg-success/10 text-success',
  };

  return (
    <Card variant={onAction ? "interactive" : "default"} className="border border-outline-variant bg-surface-container-lowest shadow-card h-full flex flex-col overflow-hidden">
      <CardContent className="p-0 flex flex-col sm:flex-row h-full">
        {/* Date block */}
        <div className="bg-primary/5 text-primary sm:w-24 flex flex-row sm:flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-e border-outline-variant/50 shrink-0 gap-2 sm:gap-0">
          <span className="text-sm font-bold uppercase">{monthStr}</span>
          <span className="text-3xl font-black">{day}</span>
        </div>
        
        {/* Content block */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg text-on-surface leading-tight">{event.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${typeColors[event.type?.toLowerCase()] || 'bg-surface-container text-on-surface-variant'}`}>
                {event.type}
              </span>
            </div>
            
            {event.description && (
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 
                <span dir="ltr">{event.time} {event.endTime ? `- ${event.endTime}` : ''}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">location_on</span> 
                {event.location}
              </span>
            </div>
          </div>

          {/* Action block */}
          {(onAction || actionLabel) && (
            <div className="pt-2 sm:pt-0 sm:mt-auto flex justify-end shrink-0">
              <Button 
                variant={actionVariant} 
                size="sm" 
                onClick={onAction}
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
