'use client';

import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/stores/notifications.store';

export function NotificationBell() {
 const { notifications, fetchNotifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
 const [isOpen, setIsOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
 // Initial fetch
 fetchNotifications();

 // Polling could be set up here if needed
 }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    await markAllAsRead();
    setIsLoading(false);
  };

 return (
 <div className="relative">
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="relative p-2 rounded-full hover:bg-surface-container :bg-surface-container transition-colors duration-200"
 aria-label="Notifications"
 >
 <span className="material-symbols-outlined text-[24px] text-on-surface ">notifications</span>
 {unreadCount() > 0 && (
 <span className="absolute top-1 end-1 w-5 h-5 bg-error text-on-error text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
 {unreadCount() > 9 ? '9+' : unreadCount()}
 </span>
 )}
 </button>

 {isOpen && (
 <div className="absolute end-0 mt-2 w-96 bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
 <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
 <h3 className="font-bold text-on-surface flex items-center gap-2">
 <span className="material-symbols-outlined">notifications_active</span>
 Notifications
 </h3>
 {unreadCount() > 0 && (
 <button 
 onClick={handleMarkAllAsRead}
 disabled={isLoading}
 className="text-xs text-primary font-bold hover:underline disabled:opacity-50"
 >
 {isLoading ? 'Marking...' : 'Mark all read'}
 </button>
 )}
 </div>
 
 <div className="max-h-96 overflow-y-auto">
 {(!notifications || notifications.length === 0) ? (
 <div className="p-8 text-center text-on-surface-variant ">
 <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">notifications_off</span>
 <p className="text-sm font-medium">No notifications yet</p>
 </div>
 ) : (
 <div className="divide-y divide-outline-variant/30 ">
 {(notifications || []).map((notif) => (
 <div 
 key={notif.id}
 onClick={() => {
 if (!notif.isRead) handleMarkAsRead(notif.id);
 }}
 className={`p-4 hover:bg-surface-container :bg-dark-surface-container cursor-pointer transition-all duration-200 group ${
 !notif.isRead ? 'bg-primary/8 border-s-2 border-s-primary ' : ''
 }`}
 >
 <div className="flex justify-between items-start gap-2 mb-2">
 <div className="flex-1">
 <h4 className={`text-sm transition-colors duration-200 ${
 !notif.isRead 
 ? 'font-black text-on-surface ' 
 : 'font-semibold text-on-surface-variant '
 }`}>
 {notif.titleEn}
 </h4>
 <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
 {notif.messageEn}
 </p>
 </div>
 {!notif.isRead && (
 <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-pulse" />
 )}
 </div>
 <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <span className="text-xs text-on-surface-variant ">
 {new Date(notif.createdAt).toLocaleString('en-US', {
 month: 'short',
 day: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 })}
 </span>
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleDelete(notif.id);
 }}
 className="text-xs text-error hover:underline font-medium"
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

