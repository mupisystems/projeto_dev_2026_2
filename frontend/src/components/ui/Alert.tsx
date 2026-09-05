import { cn } from '../../lib/cn';

export type AlertVariant = 'error' | 'warning' | 'success' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<AlertVariant, string> = {
  error: 'bg-danger border-danger text-danger',
  warning: 'bg-warning border-warning text-warning',
  success: 'bg-success border-success text-success',
  info: 'bg-info border-info text-info',
};

export function Alert({
  children,
  variant = 'info',
  className,
  title,
  icon,
}: AlertProps): React.ReactNode {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 text-sm',
        variantStyles[variant],
        className,
      )}
      role="alert"
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold">{title}</p>}
        <div className={cn(title && 'mt-0.5')}>{children}</div>
      </div>
    </div>
  );
}
