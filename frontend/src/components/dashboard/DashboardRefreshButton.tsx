import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

interface DashboardRefreshButtonProps {
  carregando: boolean;
  recarregando: boolean;
  onRefresh: () => void;
}

export function DashboardRefreshButton({
  carregando,
  recarregando,
  onRefresh,
}: DashboardRefreshButtonProps): ReactNode {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="gap-2"
      disabled={carregando || recarregando}
      onClick={onRefresh}
      title="Recarregar agendamentos"
    >
      <svg
        className={cn('h-4 w-4 text-accent', recarregando && 'animate-spin-reverse')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span className="hidden md:inline">Atualizar</span>
    </Button>
  );
}
