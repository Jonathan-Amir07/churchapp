'use client';
import { SidebarShell } from './SidebarShell';

const ADMIN_NAV = [
  { key: 'dashboard',  icon: 'dashboard',      href: '/admin/dashboard' },
  { key: 'students',   icon: 'diversity_3',    href: '/admin/students' },
  { key: 'users',      icon: 'manage_accounts',href: '/admin/users' },
  { key: 'classes',    icon: 'groups',         href: '/admin/classes' },
  { key: 'lessons',    icon: 'auto_stories',   href: '/admin/lessons' },
  { key: 'tasks',      icon: 'assignment',     href: '/admin/tasks' },
  { key: 'attendance', icon: 'how_to_reg',     href: '/admin/attendance' },
  { key: 'events',     icon: 'event',          href: '/admin/events' },
  { key: 'rewards',    icon: 'redeem',         href: '/admin/rewards' },
  { key: 'analytics',  icon: 'analytics',      href: '/admin/analytics' },
  { key: 'settings',   icon: 'settings',       href: '/admin/settings' },
];

export function AdminSidebar() {
  return <SidebarShell items={ADMIN_NAV} roleLabel="مسؤول الخدمة" />;
}
