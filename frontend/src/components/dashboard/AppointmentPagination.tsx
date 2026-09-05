import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

interface AppointmentPaginationProps {
  pagina: number;
  totalPaginas: number;
  totalRegistros: number;
  carregando: boolean;
  onPaginaChange: (pagina: number) => void;
}

export function AppointmentPagination({
  pagina,
  totalPaginas,
  totalRegistros,
  carregando,
  onPaginaChange,
}: AppointmentPaginationProps): ReactNode {
  if (totalPaginas <= 1) return null;

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-default pt-4 sm:flex-row">
      <span className="text-2xs font-medium text-muted">
        Mostrando página <strong className="text-primary">{pagina}</strong> de{' '}
        <strong className="text-primary">{totalPaginas}</strong> ({totalRegistros} registros no
        total)
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1"
          disabled={pagina === 1 || carregando}
          onClick={() => {
            onPaginaChange(Math.max(1, pagina - 1));
          }}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Anterior
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                onPaginaChange(num);
              }}
              className={cn(
                'h-7 w-7 rounded-lg text-2xs font-bold transition-all',
                num === pagina ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:bg-inset',
              )}
            >
              {num}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1"
          disabled={pagina === totalPaginas || carregando}
          onClick={() => {
            onPaginaChange(Math.min(totalPaginas, pagina + 1));
          }}
        >
          Próximo
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
