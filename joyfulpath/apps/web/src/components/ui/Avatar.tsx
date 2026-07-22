'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  badge?: number | string;
  badgeColor?: string;
  className?: string;
  ring?: boolean;
  ringColor?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  badge,
  badgeColor = 'bg-primary',
  className,
  ring = false,
  ringColor = 'ring-primary',
}: AvatarProps) {
  const sizeStyles = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const imageSizes = {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const badgeSizes = {
    xs: 'w-4 h-4 text-[10px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-7 h-7 text-sm',
    xl: 'w-8 h-8 text-base',
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-bold',
          sizeStyles[size],
          ring && `ring-3 ${ringColor} ring-offset-2 ring-offset-surface`,
          !src && 'bg-primary-fixed text-on-primary-fixed'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={imageSizes[size]}
            height={imageSizes[size]}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      {badge !== undefined && (
        <span
          className={cn(
            'absolute -bottom-0.5 -end-0.5 rounded-full flex items-center justify-center font-bold text-white',
            badgeSizes[size],
            badgeColor
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
