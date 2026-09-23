'use client';
import { SidebarShell } from './SidebarShell';

const INSTRUCTOR_NAV = [
  { key: 'dashboard',  icon: 'dashboard',       href: '/instructor/dashboard' },
  { key: 'classes',    icon: 'groups',          href: '/instructor/classes' },
  { key: 'lessons',    icon: 'auto_stories',    href: '/instructor/lessons' },
  { key: 'tasks',      icon: 'assignment',      href: '/instructor/tasks' },
  { key: 'attendance', icon: 'qr_code_scanner', href: '/instructor/attendance' },
  { key: 'quizzes',    icon: 'quiz',            href: '/instructor/quizzes' },
  { key: 'students',   icon: 'diversity_3',     href: '/instructor/students' },
  { key: 'store',      icon: 'redeem',          href: '/instructor/store' },
];

export function InstructorSidebar() {
  return <SidebarShell items={INSTRUCTOR_NAV} roleLabel="خادم" />;
}
