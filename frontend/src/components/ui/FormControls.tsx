import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';

// ─── Input ────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftAddon, rightAddon, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const effectiveLeft = leftAddon || leftIcon;
    const effectiveRight = rightAddon || rightIcon;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {effectiveLeft && (
            <div className="absolute left-3.5 text-surface-400 flex items-center pointer-events-none">
              {effectiveLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-xl border bg-surface-900 text-surface-100',
              'px-4 py-2.5 text-sm',
              'placeholder:text-surface-500',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-surface-950]',
              error
                ? 'border-red-500/60 focus:ring-red-500/50'
                : 'border-surface-700 focus:border-brand-500/60 focus:ring-brand-500/30',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              effectiveLeft ? 'pl-10' : '',
              effectiveRight ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {effectiveRight && (
            <div className="absolute right-3.5 text-surface-400 flex items-center">
              {effectiveRight}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={['text-xs', error ? 'text-red-400' : 'text-surface-500'].join(' ')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl border bg-surface-900 text-surface-100',
            'px-4 py-2.5 text-sm resize-none',
            'placeholder:text-surface-500',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-surface-950]',
            error
              ? 'border-red-500/60 focus:ring-red-500/50'
              : 'border-surface-700 focus:border-brand-500/60 focus:ring-brand-500/30',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        />
        {(error || helperText) && (
          <p className={['text-xs', error ? 'text-red-400' : 'text-surface-500'].join(' ')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl border bg-surface-900 text-surface-100',
            'px-4 py-2.5 text-sm appearance-none',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-surface-950]',
            error
              ? 'border-red-500/60 focus:ring-red-500/50'
              : 'border-surface-700 focus:border-brand-500/60 focus:ring-brand-500/30',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p className={['text-xs', error ? 'text-red-400' : 'text-surface-500'].join(' ')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
