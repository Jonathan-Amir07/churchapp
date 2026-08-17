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

interface NotificationStore {
  // Toasts (ephemeral)
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;

  // App Notifications (persistent)
  notifications: AppNotification[];
  fetchNotifications: () => Promise<void>;
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
      notifications: [],
      fetchNotifications: async () => {
        try {
          const res = await fetch('/api/notifications');
          if (res.ok) {
            const data = await res.json();
            // Maps backend Notification model to AppNotification
            const mapped = data.notifications.map((n: any) => ({
              id: n.id,
              type: n.type,
              titleEn: n.titleEn,
              titleAr: n.titleAr || n.titleEn,
              messageEn: n.messageEn,
              messageAr: n.messageAr || n.messageEn,
              isRead: n.isRead,
              createdAt: n.createdAt,
              link: n.actionUrl,
              icon: NOTIFICATION_ICONS[n.type as AppNotificationType] || 'notifications'
            }));
            set({ notifications: mapped });
          }
        } catch (e) {
          console.error('Failed to fetch notifications', e);
        }
      },

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
