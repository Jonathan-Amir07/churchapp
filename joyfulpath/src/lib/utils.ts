import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with conditional support.
 * Uses clsx for conditional class composition.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format XP number with commas.
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Format points display.
 */
export function formatPoints(points: number): string {
  return `${points.toLocaleString()} pts`;
}

/**
 * Calculate percentage for progress bars.
 */
export function calculateProgress(current: number, min: number, max: number): number {
  if (max <= min) return 100;
  return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
}

/**
 * Get initials from a display name.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date relative to now (e.g., "2 hours ago").
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return then.toLocaleDateString();
}

/**
 * Truncate text to a max length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate a random 4-digit PIN.
 */
export function generatePIN(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Generate a username from first and last name.
 */
export function generateUsername(firstName: string, lastName: string): string {
  const base = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 40);
  const suffix = Math.floor(Math.random() * 100);
  return `${base}${suffix}`;
}

/**
 * Sleep utility for animations/delays.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determine text direction from locale.
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
