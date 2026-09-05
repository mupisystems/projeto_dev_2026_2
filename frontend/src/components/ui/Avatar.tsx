import { useState } from 'react';

import { cn } from '../../lib/cn';

export interface AvatarProps {
  name: string;
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CORES_AVATAR = [
  'bg-teal-500 text-white dark:bg-teal-600',
  'bg-emerald-500 text-white dark:bg-emerald-600',
  'bg-cyan-500 text-white dark:bg-cyan-600',
  'bg-amber-500 text-white dark:bg-amber-600',
  'bg-indigo-500 text-white dark:bg-indigo-600',
  'bg-rose-500 text-white dark:bg-rose-600',
];

export function Avatar({ name, src, alt, size = 'md', className }: AvatarProps): React.ReactNode {
  const [imagemErro, setImagemErro] = useState(false);

  const partes = name.trim().split(/\s+/);
  const iniciais =
    partes.length === 1
      ? partes[0].slice(0, 2).toUpperCase()
      : (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const cor = CORES_AVATAR[Math.abs(hash) % CORES_AVATAR.length];

  const tamanhoClasses = {
    'h-8 w-8 text-[10px]': size === 'sm',
    'h-10 w-10 text-xs': size === 'md',
    'h-14 w-14 text-base': size === 'lg',
  };

  if (src && !imagemErro) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full border-2 border-surface shadow-sm ring-1 ring-border-subtle',
          tamanhoClasses,
          className,
        )}
      >
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={() => {
            setImagemErro(true);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-black shadow-sm select-none',
        tamanhoClasses,
        cor,
        className,
      )}
    >
      {iniciais}
    </div>
  );
}
