import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full rounded-xl border bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted',
          'transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
          'disabled:bg-inset disabled:cursor-not-allowed',
          {
            'border-danger bg-danger/10 focus-visible:border-danger focus-visible:ring-danger/20':
              error,
            'border-default hover:border-hover': !error,
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted',
          'transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
          'disabled:bg-inset disabled:cursor-not-allowed',
          {
            'border-danger bg-danger/10 focus-visible:border-danger focus-visible:ring-danger/20':
              error,
            'border-default hover:border-hover': !error,
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
