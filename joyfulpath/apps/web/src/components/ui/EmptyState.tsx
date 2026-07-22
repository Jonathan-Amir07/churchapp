'use client';

import { clsx } from 'clsx';

interface EmptyStateProps {
  icon: string; // Material Symbols icon name
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <span className="material-symbols-outlined text-6xl text-on-surface-variant dark:text-dark-on-surface-variant opacity-40 mb-4">
        {icon}
      </span>
      <h3 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2 bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary rounded-full font-semibold hover:shadow-lg transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoLessonsState() {
  return (
    <EmptyState
      icon="school"
      title="No Lessons Yet"
      description="There are no lessons available for this class. Check back soon or contact your instructor."
    />
  );
}

export function NoHomeworkState() {
  return (
    <EmptyState
      icon="assignment"
      title="No Homework"
      description="Great job! You've completed all your homework assignments."
    />
  );
}

export function NoNotificationsState() {
  return (
    <EmptyState
      icon="notifications_off"
      title="All Caught Up!"
      description="You don't have any new notifications. Check back later."
    />
  );
}

export function NoStudentsState() {
  return (
    <EmptyState
      icon="group"
      title="No Students"
      description="There are no students in this class yet."
    />
  );
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="error"
      title="Oops!"
      description={message}
      action={
        onRetry
          ? {
              label: 'Try Again',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

export default EmptyState;
