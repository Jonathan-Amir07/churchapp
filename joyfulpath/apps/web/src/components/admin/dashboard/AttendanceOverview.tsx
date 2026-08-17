'use client';

import { Card, CardContent } from '@/components/ui';

export function AttendanceOverview() {
  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">event_available</span>
          نظرة عامة على الحضور (اليوم)
        </h3>
        <div className="flex-1 flex items-center justify-around">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">85%</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1">نسبة الحضور</p>
          </div>
          <div className="w-px h-12 bg-outline-variant/40"></div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-on-surface">120</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1">حاضر</p>
          </div>
          <div className="w-px h-12 bg-outline-variant/40"></div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-red-500">21</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1">غائب</p>
          </div>
        </div>
        <div className="mt-4 bg-surface-container rounded-full h-2 overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
        </div>
      </CardContent>
    </Card>
  );
}
