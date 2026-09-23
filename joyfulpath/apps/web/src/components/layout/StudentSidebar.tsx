'use client';
import { SidebarShell } from './SidebarShell';

const STUDENT_NAV = [
  { key: 'dashboard',       icon: 'home',               href: '/student/dashboard' },
  { key: 'lessons',         icon: 'auto_stories',       href: '/student/lessons' },
  { key: 'tasks',           icon: 'assignment',         href: '/student/tasks' },
  { key: 'quizzes',         icon: 'quiz',               href: '/student/quizzes' },
  { key: 'leaderboard',     icon: 'leaderboard',        href: '/student/leaderboard' },
  { key: 'store',           icon: 'redeem',             href: '/student/store' },
  { key: 'reading',         icon: 'menu_book',          href: '/student/reading' },
  { key: 'events',          icon: 'event',              href: '/student/events' },
  { key: 'prayer-requests', icon: 'volunteer_activism', href: '/student/prayer-requests' },
  { key: 'profile',         icon: 'manage_accounts',    href: '/student/profile' },
];

export function StudentSidebar() {
  return <SidebarShell items={STUDENT_NAV} roleLabel="مخدوم" />;
}
