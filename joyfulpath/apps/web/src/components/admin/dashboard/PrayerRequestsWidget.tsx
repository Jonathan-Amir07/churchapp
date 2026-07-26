'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function PrayerRequestsWidget() {
  const requests = [
    { name: 'مجهول', text: 'من أجل امتحاناتي الأسبوع القادم', time: 'منذ ساعتين' },
    { name: 'فادي رمزي', text: 'صلاة من أجل جدتي مريضة جداً', time: 'منذ 5 ساعات' },
  ];

  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest h-full">
      <CardHeader className="pb-2 border-b border-outline-variant/30">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500 text-[18px]">volunteer_activism</span>
          طلبات الصلاة الحديثة
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {requests.map((req, i) => (
            <div key={i} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
              <p className="text-sm text-on-surface font-medium leading-relaxed">&quot;{req.text}&quot;</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-secondary">{req.name}</span>
                <span className="text-[10px] text-on-surface-variant">{req.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
