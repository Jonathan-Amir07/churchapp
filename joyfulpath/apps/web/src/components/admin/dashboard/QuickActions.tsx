'use client';

import { Card, CardContent } from '@/components/ui';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    { label: 'إضافة طالب', icon: 'person_add', href: '/admin/students/new', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { label: 'أخذ الغياب', icon: 'how_to_reg', href: '/admin/attendance', color: 'bg-green-100 text-green-600 border-green-200' },
    { label: 'إنشاء حدث', icon: 'event_note', href: '/admin/events/new', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { label: 'إرسال تنبيه', icon: 'campaign', href: '/admin/crm', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  ];

  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest h-full">
      <CardContent className="p-4 flex flex-col h-full justify-center">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <Link key={i} href={action.href} className={`flex items-center gap-2 p-2 rounded-md border transition-all hover:scale-[1.02] hover:shadow-sm ${action.color}`}>
              <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
              <span className="text-xs font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
