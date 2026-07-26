'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function TasksTimeline() {
  const tasks = [
    { title: 'تحضير درس الأحد', time: 'غداً 10:00 ص', status: 'pending', type: 'lesson' },
    { title: 'مراجعة واجبات الصف الخامس', time: 'اليوم 05:00 م', status: 'urgent', type: 'assignment' },
    { title: 'الاتصال بوالد يوسف', time: 'اليوم 07:00 م', status: 'pending', type: 'call' },
  ];

  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span>
          المهام والأحداث القادمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:right-2 before:w-0.5 before:bg-outline-variant/30">
          {tasks.map((task, i) => (
            <div key={i} className="relative pr-6">
              <span className={`absolute right-[3px] top-1.5 w-2 h-2 rounded-full border-2 border-surface-container-lowest ${task.status === 'urgent' ? 'bg-red-500 ring-2 ring-red-200' : 'bg-primary'}`}></span>
              <div>
                <p className="text-sm font-bold text-on-surface leading-tight">{task.title}</p>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {task.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
