import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-surface-800 text-surface-300 border border-surface-700',
  brand:    'bg-brand-500/15 text-brand-300 border border-brand-500/30',
  success:  'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  warning:  'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  danger:   'bg-red-500/15 text-red-300 border border-red-500/30',
  info:     'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  outline:  'bg-transparent text-surface-300 border border-surface-600',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-surface-400',
  brand:   'bg-brand-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
  outline: 'bg-surface-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={['w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant]].join(' ')} />
      )}
      {children}
    </span>
  );
}
