import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '../../lib/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'active:scale-95',
          {
            'h-8 w-8': size === 'sm',
            'h-10 w-10': size === 'md',
          },
          {
            'bg-surface text-secondary hover:bg-surface-hover hover:text-primary border border-default':
              variant === 'default',
            'text-secondary hover:bg-surface-hover hover:text-primary': variant === 'ghost',
            'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white': variant === 'danger',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
