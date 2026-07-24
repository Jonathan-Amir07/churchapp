import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export type AppNotificationType = 'lesson' | 'challenge' | 'badge' | 'reward' | 'announcement' | 'prayer' | 'event';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  icon: string;
}

const NOTIFICATION_ICONS: Record<AppNotificationType, string> = {
  lesson: 'menu_book',
  challenge: 'explore',
  badge: 'military_tech',
  reward: 'redeem',
  announcement: 'campaign',
  prayer: 'volunteer_activism',
  event: 'event',
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'badge',
    titleEn: 'Badge Unlocked! 🏆',
    titleAr: 'تم فتح شارة جديدة! 🏆',
    messageEn: 'Congratulations! You earned the "Attendance Hero" badge for 5 consecutive check-ins.',
    messageAr: 'مبروك! لقد حصلت على شارة "بطل الحضور" لتسجيل حضورك 5 مرات متتالية.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    link: '/student/badges',
    icon: 'military_tech',
  },
  {
    id: 'n2',
    type: 'lesson',
    titleEn: 'New Lesson Available 📖',
    titleAr: 'درس جديد متاح 📖',
    messageEn: 'Lesson 3: "David and Goliath" is now unlocked. Start learning and earn +50 XP!',
    messageAr: 'الدرس ٣: "داود وجليات" متاح الآن. ابدأ التعلم واربح +50 نقطة خبرة!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    link: '/student/lessons',
    icon: 'menu_book',
  },
  {
    id: 'n3',
    type: 'challenge',
    titleEn: 'Challenge Expiring Soon ⏰',
    titleAr: 'التحدي ينتهي قريباً ⏰',
    messageEn: 'Your daily challenge "Quiz Champion" expires in 3 hours. Complete 1 more quiz to claim your reward!',
    messageAr: 'تحديك اليومي "بطل الاختبارات" ينتهي خلال 3 ساعات. أكمل اختبار واحد آخر للحصول على مكافأتك!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: '/student/challenges',
    icon: 'explore',
  },
  {
    id: 'n4',
    type: 'reward',
    titleEn: 'Reward Approved ✅',
    titleAr: 'تم الموافقة على المكافأة ✅',
    messageEn: 'Your redemption of "Illustrated Bible Storybook" has been approved! Ask your teacher for pickup.',
    messageAr: 'تم الموافقة على طلب استبدال "قصص الكتاب المقدس المصورة"! اسأل معلمك عن موعد الاستلام.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/student/store',
    icon: 'redeem',
  },
  {
    id: 'n5',
    type: 'event',
    titleEn: 'Upcoming Event 🎉',
    titleAr: 'فعالية قادمة 🎉',
    messageEn: 'Summer Bible Camp starts next Sunday! Register now to secure your spot.',
    messageAr: 'معسكر الكتاب المقدس الصيفي يبدأ الأحد القادم! سجل الآن لحجز مكانك.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: '/student/events',
    icon: 'event',
  },
  {
    id: 'n6',
    type: 'prayer',
    titleEn: 'Prayer Answered 🙏',
    titleAr: 'تم الرد على الصلاة 🙏',
    messageEn: 'A servant responded to your prayer request with words of encouragement.',
    messageAr: 'قام معلمك بالرد على طلب صلاتك بكلمات تشجيع.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    link: '/student/prayers',
    icon: 'volunteer_activism',
  },
];

interface NotificationStore {
  // Toasts (ephemeral)
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;

  // App Notifications (persistent)
  notifications: AppNotification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead' | 'icon'>) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // === TOASTS ===
      toasts: [],
      addToast: (message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }],
        }));

        if (duration > 0) {
          setTimeout(() => {
            set((state) => ({
              toasts: state.toasts.filter((t) => t.id !== id),
            }));
          }, duration);
        }
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // === APP NOTIFICATIONS ===
      notifications: INITIAL_NOTIFICATIONS,

      unreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substring(2, 9),
              createdAt: new Date().toISOString(),
              isRead: false,
              icon: NOTIFICATION_ICONS[notification.type] || 'notifications',
            },
            ...state.notifications,
          ],
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'joyfulpath-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    }
  )
);

export default useNotificationStore;
