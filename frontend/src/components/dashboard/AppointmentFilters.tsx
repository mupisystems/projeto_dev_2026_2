import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { IconButton } from '../ui/IconButton';

import type { MetricasKpi } from './DashboardKpiCards';

interface AppointmentFiltersProps {
  metricas: MetricasKpi;
  statusFiltro: string;
  onSelectStatus: (id: string) => void;
  busca: string;
  onBuscaChange: (busca: string) => void;
  acoesDireita?: ReactNode;
}

export function AppointmentFilters({
  metricas,
  statusFiltro,
  onSelectStatus,
  busca,
  onBuscaChange,
  acoesDireita,
}: AppointmentFiltersProps): ReactNode {
  const tabs = [
    { id: '', label: 'Todos', contagem: metricas.totalGeral },
    { id: 'PENDENTE', label: 'Pendentes', contagem: metricas.pendentes },
    { id: 'CONFIRMADO', label: 'Confirmados', contagem: metricas.confirmados },
    { id: 'ATENDIDO', label: 'Atendidos', contagem: metricas.atendidos },
    { id: 'CANCELADO', label: 'Cancelados', contagem: metricas.cancelados },
  ];

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-default lg:flex-row lg:items-center lg:justify-between">
      {/* Abas de filtro por status */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const isAtivo = statusFiltro === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onSelectStatus(tab.id);
              }}
              className={cn(
                'group flex items-center gap-2 whitespace-nowrap rounded-2xl px-3.5 py-2 text-2xs font-bold transition-all',
                isAtivo
                  ? 'bg-accent text-white shadow-md shadow-accent/25'
                  : 'bg-inset text-secondary hover:bg-surface-hover hover:text-primary',
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-3xs font-black transition-colors',
                  isAtivo
                    ? 'bg-white/20 text-white'
                    : 'bg-default text-muted group-hover:text-accent',
                )}
              >
                {tab.contagem}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca e Ações adicionais */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar paciente ou e-mail..."
            value={busca}
            onChange={(e) => {
              onBuscaChange(e.target.value);
            }}
            className="w-full rounded-2xl border border-default bg-surface py-2 pl-10 pr-9 text-sm text-primary placeholder:text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
          />
          {busca && (
            <IconButton
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => {
                onBuscaChange('');
              }}
              aria-label="Limpar busca"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          )}
        </div>

        {acoesDireita}
      </div>
    </div>
  );
}
