'use client';
import { SidebarShell } from './SidebarShell';

const PRIEST_NAV = [
  { key: 'dashboard',  icon: 'dashboard',       href: '/priest/dashboard' },
  { key: 'students',   icon: 'diversity_3',     href: '/priest/students' },
  { key: 'families',   icon: 'family_restroom', href: '/priest/families' },
  { key: 'attendance', icon: 'how_to_reg',      href: '/priest/attendance' },
  { key: 'reports',    icon: 'bar_chart',       href: '/priest/reports' },
  { key: 'progress',   icon: 'trending_up',     href: '/priest/progress' },
];

export function PriestSidebar() {
  return <SidebarShell items={PRIEST_NAV} roleLabel="أبونا الكاهن" />;
}
