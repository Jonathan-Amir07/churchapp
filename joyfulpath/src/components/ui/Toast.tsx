'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNotificationStore, type ToastMessage } from '@/stores/notifications.store';

export function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed bottom-5 end-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none p-4 md:p-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  const bgStyles = {
    success: 'border-tertiary bg-surface-container-lowest text-on-surface shadow-card',
    error: 'border-error bg-surface-container-lowest text-on-surface shadow-card',
    info: 'border-primary bg-surface-container-lowest text-on-surface shadow-card',
  };

  const textColors = {
    success: 'text-tertiary',
    error: 'text-error',
    info: 'text-primary',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={cn(
        'pointer-events-auto flex items-center gap-3 p-4 border-s-4 rounded-xl shadow-tactile border bg-surface-container-lowest relative overflow-hidden',
        bgStyles[toast.type]
      )}
    >
      <span className={cn('material-symbols-outlined text-[24px] flex-shrink-0', textColors[toast.type])}>
        {iconMap[toast.type]}
      </span>
      <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-on-surface-variant hover:text-on-surface flex-shrink-0 p-1 hover:bg-surface-container rounded-full transition-colors"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </motion.div>
  );
}
