'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Mock data for student
  const student = {
    id: resolvedParams.id,
    name: 'Jonathan Amir',
    username: 'jonathan_amir',
    class: 'الصف الخامس',
    parent: 'أمير بطرس',
    parentPhone: '0123456789',
    attendance: '85%',
    totalXp: 450,
    totalPoints: 90,
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/students" className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">ملف الطالب</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="col-span-1 border-secondary/20 shadow-sm bg-surface-container-lowest">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold border-4 border-primary/20">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black">{student.name}</h2>
              <p className="text-sm text-on-surface-variant">@{student.username}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold text-on-surface-variant">
                {student.class}
              </span>
            </div>
            <div className="w-full pt-4 border-t border-outline-variant/30 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ولي الأمر:</span>
                <span className="font-bold">{student.parent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">رقم التواصل:</span>
                <span className="font-bold dir-ltr">{student.parentPhone}</span>
              </div>
            </div>
            <Button variant="primary" fullWidth className="mt-4">
              مراسلة ولي الأمر
            </Button>
          </CardContent>
        </Card>

        {/* Stats & Details */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-surface-container-lowest border-outline-variant/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-bold text-on-surface-variant mb-1">الغياب/الحضور</p>
                <p className="text-2xl font-black text-green-600">{student.attendance}</p>
              </CardContent>
            </Card>
            <Card className="bg-surface-container-lowest border-outline-variant/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-bold text-on-surface-variant mb-1">XP</p>
                <p className="text-2xl font-black text-primary">{student.totalXp}</p>
              </CardContent>
            </Card>
            <Card className="bg-surface-container-lowest border-outline-variant/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-bold text-on-surface-variant mb-1">النقاط</p>
                <p className="text-2xl font-black text-secondary">{student.totalPoints}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest h-64 flex items-center justify-center">
            <div className="text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">analytics</span>
              <p className="font-bold">سيتم عرض المخططات البيانية وسجل الحضور هنا</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
