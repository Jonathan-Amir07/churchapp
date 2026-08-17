'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function BirthdaysList() {
  const birthdays = [
    { name: 'مينا عادل', date: 'اليوم', class: 'الصف الخامس', age: 10 },
    { name: 'مارينا مجدي', date: 'غداً', class: 'الصف السادس', age: 11 },
    { name: 'كيرلس سمير', date: 'بعد يومين', class: 'الصف الرابع', age: 9 },
  ];

  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">cake</span>
          أعياد الميلاد القادمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {birthdays.map((b, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs border border-secondary/20">
                  {b.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-none">{b.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{b.class} • {b.age} سنوات</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${b.date === 'اليوم' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {b.date}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
