import { type SelectHTMLAttributes, forwardRef } from 'react';

import { cn } from '../../lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-xl border bg-surface px-4 py-3 text-sm text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
            'disabled:bg-inset',
            {
              'border-danger bg-danger/10 focus-visible:border-danger focus-visible:ring-danger/20':
                error,
              'border-default hover:border-hover': !error,
            },
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
