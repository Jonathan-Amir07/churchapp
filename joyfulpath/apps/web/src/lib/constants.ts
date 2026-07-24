// ============================================
// JoyfulPath Constants
// ============================================

/**
 * Supported locales and their text directions.
 */
export const LOCALES = {
  en: { label: 'English', dir: 'ltr' as const },
  ar: { label: 'العربية', dir: 'rtl' as const },
} as const;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Navigation items per role.
 */
export const NAV_ITEMS = {
  student: [
    { key: 'dashboard',   icon: 'dashboard',          href: '/student/dashboard' },
    { key: 'journey',     icon: 'timeline',           href: '/student/journey' },
    { key: 'lessons',     icon: 'menu_book',           href: '/student/lessons' },
    { key: 'tasks',       icon: 'task_alt',            href: '/student/tasks' },
    { key: 'quizzes',     icon: 'quiz',                href: '/student/quizzes' },
    { key: 'events',      icon: 'event',               href: '/student/events' },
    { key: 'games',       icon: 'sports_esports',      href: '/student/games' },
    { key: 'challenges',  icon: 'explore',             href: '/student/challenges' },
    { key: 'store',       icon: 'shopping_bag',        href: '/student/store' },
    { key: 'prayers',     icon: 'volunteer_activism',  href: '/student/prayers' },
    { key: 'leaderboard', icon: 'leaderboard',         href: '/student/leaderboard' },
    { key: 'badges',      icon: 'military_tech',       href: '/student/badges' },
    { key: 'qrCode',      icon: 'qr_code_2',           href: '/student/qr-code' },
    { key: 'profile',     icon: 'person',              href: '/student/profile' },
  ],
  parent: [
    { key: 'dashboard',   icon: 'dashboard',           href: '/parent/dashboard' },
    { key: 'attendance',  icon: 'event_available',     href: '/parent/attendance' },
    { key: 'reports',     icon: 'bar_chart_4_bars',    href: '/parent/reports' },
    { key: 'gamification', icon: 'emoji_events',       href: '/parent/gamification' },
    { key: 'events',      icon: 'event',               href: '/parent/events' },
    { key: 'profile',     icon: 'person',              href: '/parent/profile' },
  ],
  admin: [
    { key: 'dashboard',   icon: 'dashboard',           href: '/admin/dashboard' },
    { key: 'approvals',   icon: 'verified_user',       href: '/admin/approvals' },
    { key: 'lessons',     icon: 'menu_book',           href: '/admin/lessons' },
    { key: 'tasks',       icon: 'task_alt',            href: '/admin/tasks' },
    { key: 'quizzes',     icon: 'quiz',                href: '/admin/quizzes' },
    { key: 'attendance',  icon: 'event_available',     href: '/admin/attendance' },
    { key: 'events',      icon: 'event_note',          href: '/admin/events' },
    { key: 'users',       icon: 'manage_accounts',     href: '/admin/users' },
    { key: 'classes',     icon: 'school',              href: '/admin/classes' },
    { key: 'students',    icon: 'groups',              href: '/admin/students' },
    { key: 'rewards',     icon: 'emoji_events',        href: '/admin/rewards' },
    { key: 'prayers',     icon: 'volunteer_activism',  href: '/admin/prayers' },
    { key: 'qr',          icon: 'qr_code_scanner',     href: '/admin/qr' },
    { key: 'crm',         icon: 'contact_mail',        href: '/admin/crm' },
    { key: 'files',       icon: 'folder',              href: '/admin/files' },
    { key: 'analytics',   icon: 'analytics',           href: '/admin/analytics' },
    { key: 'permissions', icon: 'security',            href: '/admin/permissions' },
    { key: 'settings',    icon: 'settings',            href: '/admin/settings' },
  ],
} as const;


/**
 * Points and XP configuration.
 */
export const GAMIFICATION = {
  /** XP awarded per action */
  xp: {
    lessonComplete: 50,
    quizPass: 50,
    quizPerfect: 25, // bonus
    taskApproved: 30,
    attendancePresent: 20,
    attendanceLate: 10,
    streakBonus5: 15,
    streakBonus10: 30,
    dailyLogin: 5,
  },
  /** Redeemable points per action */
  points: {
    lessonComplete: 10,
    quizPass: 10,
    taskApproved: 5,
    attendancePresent: 5,
    badgeUnlock: 5,
  },
  /** Streak multipliers */
  streakMultipliers: {
    5: 1.5,
    10: 2.0,
    20: 2.5,
    30: 3.0,
  } as Record<number, number>,
} as const;

/**
 * File upload configuration.
 */
export const UPLOAD = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/pdf',
    'audio/mpeg',
    'audio/mp3',
    'video/mp4',
    'video/webm',
  ],
  allowedExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.mp3', '.mp4', '.webm'],
  buckets: {
    lessons: 'lesson-attachments',
    submissions: 'task-submissions',
    avatars: 'avatars',
  },
} as const;

/**
 * Pagination defaults.
 */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

/**
 * Rate limiting configuration.
 */
export const RATE_LIMITS = {
  login: { limit: 5, window: 15 * 60 }, // 5 per 15 min
  register: { limit: 3, window: 60 * 60 }, // 3 per hour
  upload: { limit: 10, window: 60 * 60 }, // 10 per hour
  general: { limit: 100, window: 60 }, // 100 per min
} as const;

/**
 * Session configuration.
 */
export const SESSION = {
  maxAge: 7 * 24 * 60 * 60, // 7 days (refresh)
  accessTokenMaxAge: 15 * 60, // 15 minutes
  inactivityTimeout: 30 * 60, // 30 minutes auto-logout
} as const;
