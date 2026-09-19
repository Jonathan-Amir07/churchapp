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
              toasts: state.toasts?.filter((t) => t.id !== id),
            }));
          }, duration);
        }
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts?.filter((t) => t.id !== id),
        })),

      // === APP NOTIFICATIONS ===
      notifications: [],
      fetchNotifications: async () => {
        try {
          const res = await fetch('/api/notifications', {
            credentials: 'include'
          });
          if (res.ok) {
            const result = await res.json();
            
            let rawList: any[] = [];
            if (Array.isArray(result)) {
              rawList = result;
            } else if (result && Array.isArray(result.data)) {
              rawList = result.data;
            } else if (result && Array.isArray(result.notifications)) {
              rawList = result.notifications;
            }
            
            const mapped = rawList?.map((n: any) => {
              let payload: any = {};
              try {
                if (typeof n.payload === 'string') {
                  payload = JSON.parse(n.payload);
                } else if (n.payload && typeof n.payload === 'object') {
                  payload = n.payload;
                }
              } catch (e) {
                // ignore parsing error
              }

              return {
                id: n.id,
                type: n.type,
                titleEn: payload.titleEn || payload.title || n.titleEn || n.title || 'Notification',
                titleAr: payload.titleAr || payload.title || n.titleAr || n.title || 'إشعار',
                messageEn: payload.messageEn || payload.message || n.messageEn || n.message || '',
                messageAr: payload.messageAr || payload.message || n.messageAr || n.message || '',
                isRead: !!n.readAt || n.isRead || false,
                createdAt: n.createdAt || new Date().toISOString(),
                link: payload.actionUrl || payload.link || n.link || n.actionUrl,
                icon: NOTIFICATION_ICONS[n.type as AppNotificationType] || 'notifications'
              };
            });
            set({ notifications: mapped || [] });
          } else if (res.status === 401 || res.status === 403) {
            // Handle unauthorized by clearing notifications instead of crashing
            set({ notifications: [] });
          }
        } catch (e) {
          console.error('Failed to fetch notifications', e);
        }
      },

      unreadCount: () => {
        return (get().notifications || [])?.filter((n) => !n.isRead).length;
      },

      markAsRead: async (id) => {
        try {
          await fetch(`/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
            credentials: 'include'
          });
          set((state) => ({
            notifications: (state.notifications || [])?.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          }));
        } catch (e) {
          console.error('Failed to mark as read', e);
        }
      },

      markAllAsRead: async () => {
        try {
          await fetch(`/api/notifications/mark-all-read`, {
            method: 'PATCH',
            credentials: 'include'
          });
          set((state) => ({
            notifications: (state.notifications || [])?.map((n) => ({ ...n, isRead: true })),
          }));
        } catch (e) {
          console.error('Failed to mark all as read', e);
        }
      },

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
            ... (state.notifications || []),
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
