'use client';

import { useState, useEffect, useCallback } from 'react';
import { requestForToken, onMessageListener } from '@/lib/firebase';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  title_en: string;
  title_ar?: string;
  message_en: string;
  message_ar?: string;
  is_read: boolean;
  created_at: string;
  type?: string;
  action_url?: string;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [supabase]);

  useEffect(() => {
    // 1. Request FCM Token
    requestForToken();

    // 2. Initial fetch
    fetchNotifications();

    // 3. Setup Supabase realtime subscription
    let subscription: any;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        subscription = supabase
          .channel(`notifications:user_id=eq.${user.id}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          }, (payload) => {
            console.log('Notification change:', payload);
            if (payload.eventType === 'INSERT') {
              setNotifications(prev => [payload.new as Notification, ...prev]);
              setUnreadCount(prev => prev + 1);
            } else if (payload.eventType === 'UPDATE') {
              setNotifications(prev => prev.map(n => 
                n.id === payload.new.id ? payload.new as Notification : n
              ));
              if (!payload.new.is_read && payload.old?.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            } else if (payload.eventType === 'DELETE') {
              setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
            }
          })
          .subscribe();
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [supabase, fetchNotifications]);

  // 4. Listen for FCM foreground messages
  useEffect(() => {
    const listenForMessages = async () => {
      try {
        const payload: any = await onMessageListener();
        if (payload && payload.notification) {
          // Trigger refresh to get the new notification from DB
          await fetchNotifications();
        }
        listenForMessages();
      } catch (err) {
        console.warn('FCM listener error:', err);
      }
    };
    
    listenForMessages();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('is_read', false);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container transition-colors duration-200"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined text-[24px] text-on-surface dark:text-dark-on-surface">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-error dark:bg-dark-error text-on-error dark:text-dark-on-error text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-surface-container-lowest dark:bg-dark-surface-container-lowest border border-outline-variant dark:border-dark-outline-variant shadow-2xl rounded-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 bg-surface-container-low dark:bg-dark-surface-container-low border-b border-outline-variant dark:border-dark-outline-variant flex justify-between items-center">
            <h3 className="font-bold text-on-surface dark:text-dark-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined">notifications_active</span>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                disabled={isLoading}
                className="text-xs text-primary dark:text-dark-primary font-bold hover:underline disabled:opacity-50"
              >
                {isLoading ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant dark:text-dark-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">notifications_off</span>
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/30 dark:divide-dark-outline-variant/30">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 hover:bg-surface-container dark:hover:bg-dark-surface-container cursor-pointer transition-all duration-200 group ${
                      !notif.is_read ? 'bg-primary/8 dark:bg-dark-primary/8 border-l-2 border-l-primary dark:border-l-dark-primary' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className={`text-sm transition-colors duration-200 ${
                          !notif.is_read 
                            ? 'font-black text-on-surface dark:text-dark-on-surface' 
                            : 'font-semibold text-on-surface-variant dark:text-dark-on-surface-variant'
                        }`}>
                          {notif.title_en}
                        </h4>
                        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2 mt-1">
                          {notif.message_en}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-dark-primary flex-shrink-0 mt-1.5 animate-pulse" />
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                        {new Date(notif.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="text-xs text-error dark:text-dark-error hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
