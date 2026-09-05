import {
  type ButtonHTMLAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from 'react';

import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      asChild,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 font-bold transition-all select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      asChild ? '' : 'disabled:cursor-not-allowed disabled:opacity-50',
      asChild ? '' : 'active:scale-[0.98]',
      {
        'rounded-button px-3.5 py-2 text-xs': size === 'sm',
        'rounded-button px-5 py-2.5 text-sm': size === 'md',
        'rounded-2xl px-7 py-3.5 text-base': size === 'lg',
      },
      {
        'bg-accent text-white shadow-md shadow-accent/25 hover:bg-accent-hover':
          variant === 'primary',
        'bg-surface border border-default text-primary hover:border-accent hover:text-accent hover:bg-surface-hover shadow-sm':
          variant === 'secondary',
        'bg-transparent border border-accent text-accent hover:bg-accent/10': variant === 'outline',
        'text-secondary hover:text-primary hover:bg-surface-hover': variant === 'ghost',
        'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700':
          variant === 'danger',
        'bg-gradient-to-r from-accent via-[#155e75] to-accent-hover text-white shadow-lg shadow-accent/25 hover:opacity-95 hover:shadow-xl':
          variant === 'gradient',
      },
      className,
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: cn(classes, child.props.className),
        ...props,
      });
    }

    return (
      <button ref={ref} disabled={disabled || isLoading} className={classes} {...props}>
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
