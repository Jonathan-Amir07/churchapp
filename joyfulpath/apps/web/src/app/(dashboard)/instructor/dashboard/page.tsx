'use client';

import { useUser } from '@/hooks/useUser';
import { Card, CardContent } from '@/components/ui';
import Link from 'next/link';

export default function InstructorDashboard() {
  const { profile } = useUser();
  
  const manageLinks = [
    { title: 'My Classes', icon: 'class', href: '/instructor/classes', color: 'text-purple-500 bg-purple-100' },
    { title: 'Take Attendance', icon: 'how_to_reg', href: '/instructor/attendance', color: 'text-green-500 bg-green-100' },
    { title: 'My Students', icon: 'groups', href: '/instructor/students', color: 'text-blue-500 bg-blue-100' },
    { title: 'Assign Tasks', icon: 'task', href: '/instructor/tasks', color: 'text-orange-500 bg-orange-100' },
    { title: 'Lessons', icon: 'menu_book', href: '/instructor/lessons', color: 'text-teal-500 bg-teal-100' },
    { title: 'Quizzes', icon: 'quiz', href: '/instructor/quizzes', color: 'text-red-500 bg-red-100' },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-cyan-800 to-cyan-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold">
              Instructor Portal
            </h1>
          </div>
          <p className="text-base font-medium opacity-80 max-w-xl">
            Welcome, {profile?.display_name || ''}. Manage your classes, record attendance, and guide your students' spiritual journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {manageLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            <Card className="hover:-translate-y-1 hover:shadow-md transition-all border border-outline-variant cursor-pointer h-full bg-surface-container-lowest">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${link.color}`}>
                  <span className="material-symbols-outlined text-[28px]">{link.icon}</span>
                </div>
                <span className="font-bold text-sm text-on-surface">{link.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">event_upcoming</span>
              Upcoming Classes
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Grade 5 Boys', time: 'Sunday 9:00 AM', room: 'Room 204' },
                { name: 'Bible Study', time: 'Sunday 11:30 AM', room: 'Main Hall' },
              ].map((cls, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-on-surface">{cls.name}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {cls.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant font-medium bg-surface-container py-1 px-2 rounded-lg">{cls.room}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/instructor/attendance">
              <button className="w-full mt-4 py-2 bg-green-100 text-green-700 font-bold rounded-xl text-sm hover:bg-green-200 transition">Take Attendance</button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">assignment</span>
              Recent Submissions
            </h3>
            <div className="space-y-4">
              {[
                { student: 'John M.', task: 'Psalm 50 Memorization', status: 'Needs Review' },
                { student: 'Sarah K.', task: 'Genesis Quiz', status: 'Auto-Graded: 95%' },
                { student: 'Mark L.', task: 'Acts 2 Summary', status: 'Needs Review' },
              ].map((sub, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-on-surface">{sub.student}</p>
                    <p className="text-xs text-on-surface-variant">{sub.task}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${sub.status.includes('Needs') ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/instructor/tasks">
              <button className="w-full mt-4 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary/20 transition">Review All Tasks</button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
