import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
}: SectionHeaderProps): React.ReactNode {
  return (
    <div
      className={cn(
        'mx-auto max-w-2xl space-y-3',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span className="block text-xs font-bold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">{title}</h2>
      {description && <p className="text-secondary text-base sm:text-lg">{description}</p>}
    </div>
  );
}
