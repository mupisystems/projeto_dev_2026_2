import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
}

export function Card({
  children,
  className,
  variant = 'default',
  ...props
}: CardProps): React.ReactNode {
  return (
    <div
      {...props}
      className={cn(
        'rounded-card p-5 transition-all',
        variant === 'gradient'
          ? 'bg-gradient-to-r from-[#0E7490] via-[#155e75] to-[#164E63] text-white shadow-xl shadow-[#0E7490]/15'
          : 'border border-default bg-surface',
        {
          'shadow-card': variant === 'elevated',
          'border border-default': variant === 'outlined',
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps): React.ReactNode {
  return <div className={cn('mb-4 space-y-1.5', className)}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps): React.ReactNode {
  return <h3 className={cn('text-lg font-bold text-primary', className)}>{children}</h3>;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps): React.ReactNode {
  return <p className={cn('text-sm leading-relaxed text-secondary', className)}>{children}</p>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps): React.ReactNode {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps): React.ReactNode {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between gap-3 border-t border-subtle pt-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
