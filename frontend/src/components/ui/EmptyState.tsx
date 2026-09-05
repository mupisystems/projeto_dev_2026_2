import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps): React.ReactNode {
  return (
    <div className={cn('py-16 text-center', className)}>
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-hover text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-primary">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  );
}
