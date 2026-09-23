'use client';

import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import { PageTransition } from '@/components/ui';

export default function ParentNotificationsPage() {
  const { data: notifications, isLoading } = useSWR('/notifications', (url) => apiClient.get(url));

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      mutate('/notifications');
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.readAt).length : 0;

  return (
    <PageTransition className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-display-lg-mobile md:font-display-lg">الإشعارات</h1>
        <p className="font-body-md text-on-surface-variant mt-2 text-lg">متابعة غياب وتقييمات أطفالك في مدارس الأحد.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            مركز الإشعارات
            {unreadCount > 0 && (
              <span className="bg-error text-on-error text-xs font-black px-2 py-0.5 rounded-full me-2">
                {unreadCount} جديد
              </span>
            )}
          </h2>
        </div>

        <div className="divide-y divide-outline-variant">
          {(!notifications || !Array.isArray(notifications) || notifications.length === 0) ? (
            <div className="p-8 text-center text-on-surface-variant">لا توجد إشعارات حالياً</div>
          ) : (
            notifications.map((notification: any) => {
              let payload: Record<string, any> = {};
              try {
                payload = typeof notification.payload === 'string' ? JSON.parse(notification.payload) : (notification.payload || {});
              } catch (e) {
                console.error('Failed to parse notification payload', e);
              }
              const isUnread = !notification.readAt;

              return (
                <div 
                  key={notification.id} 
                  className={`p-4 md:p-6 transition-colors flex gap-4 ${isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'bg-surface-container-lowest hover:bg-surface-container-lowest'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isUnread ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined">
                      {notification.type === 'absence' ? 'event_busy' : 'assignment_turned_in'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-base md:text-lg font-bold ${isUnread ? 'text-on-background' : 'text-on-surface-variant'}`}>
                        {payload.title || 'إشعار جديد'}
                      </h3>
                      <span className="text-xs text-on-surface-variant whitespace-nowrap">
                        {new Date(notification.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm md:text-base ${isUnread ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {payload.message}
                    </p>
                    
                    {isUnread && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="mt-3 text-xs font-bold text-primary hover:text-primary-container bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded transition-colors"
                      >
                        تحديد كمقروء
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
}
