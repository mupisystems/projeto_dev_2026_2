import { cn } from '../../lib/cn';

export type BadgeVariant =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-accent/10 text-accent',
  primary: 'bg-accent/10 text-accent',
  success: 'bg-success text-success',
  warning: 'bg-warning text-warning',
  danger: 'bg-danger text-danger',
  info: 'bg-info text-info',
  neutral: 'bg-surface-hover text-secondary',
};

export function Badge({ children, variant = 'default', className }: BadgeProps): React.ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
