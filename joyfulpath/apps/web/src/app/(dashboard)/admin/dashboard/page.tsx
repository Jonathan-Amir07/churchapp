'use client';

import { useTranslations } from 'next-intl';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, PageTransition, HeroBanner, StatCard, StaggerContainer, StaggerItem } from '@/components/ui';
import Link from 'next/link';

export default function AdminDashboard() {
  const { profile } = useUser();
  
  const manageLinks = [
    { title: 'Users', icon: 'manage_accounts', href: '/admin/users', color: 'text-blue-500 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30' },
    { title: 'Families', icon: 'family_restroom', href: '/admin/families', color: 'text-green-500 bg-green-100 dark:text-green-300 dark:bg-green-900/30' },
    { title: 'Classes', icon: 'class', href: '/admin/classes', color: 'text-purple-500 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30' },
    { title: 'Instructors', icon: 'badge', href: '/admin/instructors', color: 'text-orange-500 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30' },
    { title: 'Priests', icon: 'church', href: '/admin/priests', color: 'text-indigo-500 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/30' },
    { title: 'Students', icon: 'school', href: '/admin/students', color: 'text-teal-500 bg-teal-100 dark:text-teal-300 dark:bg-teal-900/30' },
  ];

  return (
    <PageTransition className="space-y-6">
      <HeroBanner
        variant="admin"
        title="System Administration"
        subtitle={`Welcome back, ${profile?.display_name || 'Admin'}. Monitor system health, manage all entities, and oversee church operations.`}
        icon={
          <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            admin_panel_settings
          </span>
        }
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggerItem>
          <StatCard icon="groups" label="Total Members" value="1,248" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="class" label="Active Classes" value="42" iconColor="text-secondary bg-secondary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="how_to_reg" label="Weekly Attendance" value="89%" iconColor="text-success bg-success/10" trend={{ value: '+2% this week', positive: true }} />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon="campaign" label="Pending Alerts" value="5" iconColor="text-error bg-error/10" trend={{ value: 'Needs action', positive: false }} />
        </StaggerItem>
      </StaggerContainer>

      <h2 className="text-xl font-bold text-on-surface mt-8 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">dashboard_customize</span>
        Management Modules
      </h2>
      
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {manageLinks.map((link) => (
          <StaggerItem key={link.href}>
            <Link href={link.href}>
              <Card className="hover:-translate-y-1 hover:shadow-md transition-all border border-outline-variant cursor-pointer h-full bg-surface-container-lowest">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${link.color}`}>
                    <span className="material-symbols-outlined text-[28px]">{link.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-on-surface">{link.title}</span>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm stagger-item">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-secondary">history</span>
              Recent System Activity
            </h3>
            <div className="space-y-4">
              {[
                { time: '10 mins ago', text: 'New instructor account created for Mark.' },
                { time: '1 hr ago', text: 'Class "Angels" attendance submitted by Sarah.' },
                { time: '3 hrs ago', text: 'System backup completed successfully.' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">{act.text}</p>
                    <p className="text-xs text-on-surface-variant">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm stagger-item">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-error">warning</span>
              System Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-on-surface">
                <span className="font-bold text-error block mb-1">Low Storage Warning</span>
                Database storage is at 85% capacity. Consider upgrading or cleaning up old logs.
              </div>
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-on-surface">
                <span className="font-bold text-warning block mb-1">Unassigned Students</span>
                12 new students registered this week need to be assigned to a class.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
