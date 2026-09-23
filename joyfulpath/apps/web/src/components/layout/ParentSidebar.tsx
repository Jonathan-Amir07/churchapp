'use client';
import { SidebarShell } from './SidebarShell';

const PARENT_NAV = [
  { key: 'dashboard',     icon: 'dashboard',       href: '/parent/dashboard' },
  { key: 'attendance',    icon: 'how_to_reg',      href: '/parent/attendance' },
  { key: 'events',        icon: 'event',           href: '/parent/events' },
  { key: 'reports',       icon: 'bar_chart',       href: '/parent/reports' },
  { key: 'notifications', icon: 'notifications',   href: '/parent/notifications' },
  { key: 'profile',       icon: 'manage_accounts', href: '/parent/profile' },
];

export function ParentSidebar() {
  return <SidebarShell items={PARENT_NAV} roleLabel="ولي أمر" />;
}
