import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-surface-950 hover:bg-brand-400 shadow-lg shadow-[--color-brand-500]/20 font-semibold',
  secondary:
    'bg-surface-800 text-surface-100 hover:bg-surface-700 border border-surface-700',
  outline:
    'bg-transparent text-surface-100 border border-surface-700 hover:border-brand-400 hover:text-brand-400',
  ghost:
    'bg-transparent text-surface-300 hover:bg-surface-800 hover:text-surface-100',
  danger:
    'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 font-semibold',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
  sm: 'text-sm px-3.5 py-2 rounded-xl gap-2',
  md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  xl: 'text-base px-8 py-4 rounded-2xl gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled ? { scale: 1.015 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={[
          'inline-flex items-center justify-center',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        disabled={isDisabled}
        {...(props as object)}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
