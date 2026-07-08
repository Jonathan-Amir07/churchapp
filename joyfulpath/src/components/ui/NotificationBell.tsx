'use client';

import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '@/lib/firebase';
import { createClient } from '@/lib/supabase/client';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // 1. Request FCM Token
    requestForToken();

    // 2. Fetch existing notifications from Supabase
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
    }
    
    fetchNotifications();

    // 3. Listen for incoming foreground messages
    const listenForMessages = async () => {
      try {
        const payload: any = await onMessageListener();
        if (payload && payload.notification) {
          const newNotif = {
            id: String(Date.now()),
            title_en: payload.notification.title,
            title_ar: payload.notification.title,
            message_en: payload.notification.body,
            message_ar: payload.notification.body,
            is_read: false,
            created_at: new Date().toISOString()
          };
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
        // re-register listener
        listenForMessages();
      } catch (err) {
        console.warn('FCM listener error:', err);
      }
    };
    
    listenForMessages();

  }, [supabase]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map((n: any) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[24px] text-on-surface">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-2xl overflow-hidden z-50">
          <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-bold text-on-surface">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => {
                  notifications.forEach((n: any) => !n.is_read && markAsRead(n.id));
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">notifications_paused</span>
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/60">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                    className={`p-4 hover:bg-surface-container cursor-pointer transition-colors ${!notif.is_read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notif.is_read ? 'font-black text-on-surface' : 'font-bold text-on-surface-variant'}`}>
                        {notif.title_en}
                      </h4>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {notif.message_en}
                    </p>
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
