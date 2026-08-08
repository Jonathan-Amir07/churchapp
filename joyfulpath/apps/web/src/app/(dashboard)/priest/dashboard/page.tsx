'use client';

import { useUser } from '@/hooks/useUser';
import { Card, CardContent } from '@/components/ui';
import Link from 'next/link';

export default function PriestDashboard() {
  const { profile } = useUser();
  
  const manageLinks = [
    { title: 'Families', icon: 'family_restroom', href: '/priest/families', color: 'text-green-500 bg-green-100' },
    { title: 'Students', icon: 'school', href: '/priest/students', color: 'text-teal-500 bg-teal-100' },
    { title: 'Attendance', icon: 'fact_check', href: '/priest/attendance', color: 'text-blue-500 bg-blue-100' },
    { title: 'Reports', icon: 'bar_chart', href: '/priest/reports', color: 'text-purple-500 bg-purple-100' },
    { title: 'Progress', icon: 'trending_up', href: '/priest/progress', color: 'text-orange-500 bg-orange-100' },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white shadow-xl">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold">
              Priest Portal
            </h1>
          </div>
          <p className="text-base font-medium opacity-80 max-w-xl">
            Welcome, Father {profile?.display_name || ''}. Overview the spiritual growth, attendance, and progress of the congregation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <span className="material-symbols-outlined text-primary">groups</span>
              Recent Family Additions
            </h3>
            <div className="space-y-4">
              {[
                { name: 'The Smith Family', members: 4, date: 'Joined this week' },
                { name: 'The Johnson Family', members: 3, date: 'Joined last week' },
                { name: 'The Davis Family', members: 5, date: 'Joined last month' },
              ].map((fam, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-on-surface">{fam.name}</p>
                    <p className="text-xs text-on-surface-variant">{fam.members} members</p>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium bg-surface-container py-1 px-2 rounded-lg">{fam.date}</span>
                </div>
              ))}
            </div>
            <Link href="/priest/families">
              <button className="w-full mt-4 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary/20 transition">View All Families</button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-success">trending_up</span>
              Top Performing Classes
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Grade 5 Boys', instructor: 'Mark S.', attendance: '95%' },
                { name: 'Grade 3 Girls', instructor: 'Mary J.', attendance: '92%' },
                { name: 'High School Youth', instructor: 'Paul M.', attendance: '88%' },
              ].map((cls, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-on-surface">{cls.name}</p>
                    <p className="text-xs text-on-surface-variant">Instructor: {cls.instructor}</p>
                  </div>
                  <span className="text-sm font-black text-success">{cls.attendance}</span>
                </div>
              ))}
            </div>
            <Link href="/priest/reports">
              <button className="w-full mt-4 py-2 bg-success/10 text-success font-bold rounded-xl text-sm hover:bg-success/20 transition">Full Performance Report</button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
