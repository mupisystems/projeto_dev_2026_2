import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

interface KpiData {
  total: number;
  pendentes: number;
  confirmados: number;
  atendidos: number;
  totalDia: number;
}

interface AgendaKpiCardsProps {
  animacoes: KpiData;
  temPendentes: boolean;
  filtroStatus: string;
  onSelectStatus: (status: string) => void;
}

export function AgendaKpiCards({
  animacoes,
  temPendentes,
  filtroStatus,
  onSelectStatus,
}: AgendaKpiCardsProps): ReactNode {
  const cards = [
    {
      id: 'total',
      label: 'Total Geral',
      value: animacoes.total,
      desc: `${String(animacoes.totalDia)} agendado(s) no dia selecionado`,
      status: '',
      ativo: filtroStatus === '',
      cor: 'accent' as const,
      icone: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: 'PENDENTE',
      label: 'Pendentes',
      value: animacoes.pendentes,
      desc: 'Aguardando resposta',
      status: 'PENDENTE',
      ativo: filtroStatus === 'PENDENTE',
      cor: 'warning' as const,
      ping: temPendentes,
      icone: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 'CONFIRMADO',
      label: 'Confirmados',
      value: animacoes.confirmados,
      desc: 'Consultas agendadas',
      status: 'CONFIRMADO',
      ativo: filtroStatus === 'CONFIRMADO',
      cor: 'success' as const,
      icone: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 'ATENDIDO',
      label: 'Atendidos',
      value: animacoes.atendidos,
      desc: 'Procedimentos realizados',
      status: 'ATENDIDO',
      ativo: filtroStatus === 'ATENDIDO',
      cor: 'info' as const,
      icone: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((kpi) => (
        <button
          key={kpi.id}
          type="button"
          onClick={() => {
            onSelectStatus(kpi.status === filtroStatus ? '' : kpi.status);
          }}
          className={cn(
            'flex flex-col justify-between rounded-3xl p-4 sm:p-5 text-left transition-all border shadow-sm',
            kpi.ativo
              ? 'ring-2 bg-surface-hover shadow-md'
              : 'bg-surface border-default hover:border-hover hover:shadow-card',
            kpi.ativo && kpi.cor === 'accent' && 'border-accent ring-accent/20',
            kpi.ativo && kpi.cor === 'warning' && 'border-warning ring-warning/20',
            kpi.ativo && kpi.cor === 'success' && 'border-success ring-success/20',
            kpi.ativo && kpi.cor === 'info' && 'border-info ring-info/20',
            !kpi.ativo && 'border-default',
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  !kpi.ativo && 'text-muted',
                  kpi.ativo && kpi.cor === 'accent' && 'text-accent',
                  kpi.ativo && kpi.cor === 'warning' && 'text-amber-600 dark:text-amber-400',
                  kpi.ativo && kpi.cor === 'success' && 'text-emerald-600 dark:text-emerald-400',
                  kpi.ativo && kpi.cor === 'info' && 'text-cyan-600 dark:text-cyan-400',
                )}
              >
                {kpi.label}
              </span>
              {kpi.ping && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
            </div>
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-2xl transition-colors',
                kpi.ativo && kpi.cor === 'accent' && 'bg-accent text-white',
                kpi.ativo && kpi.cor === 'warning' && 'bg-amber-500 text-white',
                kpi.ativo && kpi.cor === 'success' && 'bg-emerald-500 text-white',
                kpi.ativo && kpi.cor === 'info' && 'bg-cyan-500 text-white',
                !kpi.ativo && kpi.cor === 'accent' && 'bg-accent/10 text-accent',
                !kpi.ativo &&
                  kpi.cor === 'warning' &&
                  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                !kpi.ativo &&
                  kpi.cor === 'success' &&
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                !kpi.ativo &&
                  kpi.cor === 'info' &&
                  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
              )}
            >
              {kpi.icone}
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-primary tabular-nums">
              {kpi.value}
            </span>
            <p
              className={cn(
                'text-2xs font-medium mt-0.5',
                !kpi.ativo && 'text-muted',
                kpi.ativo && kpi.cor === 'accent' && 'text-accent font-bold',
                kpi.ativo &&
                  kpi.cor === 'warning' &&
                  'text-amber-600 dark:text-amber-400 font-bold',
                kpi.ativo &&
                  kpi.cor === 'success' &&
                  'text-emerald-600 dark:text-emerald-400 font-bold',
                kpi.ativo && kpi.cor === 'info' && 'text-cyan-600 dark:text-cyan-400 font-bold',
              )}
            >
              {kpi.desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
