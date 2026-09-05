import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useContadorAnimado } from '../../hooks/useContadorAnimado';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';

export interface MetricasKpi {
  totalGeral: number;
  pendentes: number;
  confirmados: number;
  atendidos: number;
  cancelados: number;
  procedimentosAtivos: number;
}

interface DashboardKpiCardsProps {
  metricas: MetricasKpi;
  recarregando?: boolean;
  statusFiltro: string;
  onSelectStatus: (status: string) => void;
}

export function DashboardKpiCards({
  metricas,
  recarregando = false,
  statusFiltro,
  onSelectStatus,
}: DashboardKpiCardsProps): ReactNode {
  const animTotal = useContadorAnimado(metricas.totalGeral, { duracaoMs: 1200 });
  const animPendentes = useContadorAnimado(metricas.pendentes, { duracaoMs: 1000 });
  const animConfirmados = useContadorAnimado(metricas.confirmados, { duracaoMs: 1000 });
  const animAtendidos = useContadorAnimado(metricas.atendidos, { duracaoMs: 1000 });
  const animProcedimentos = useContadorAnimado(metricas.procedimentosAtivos, { duracaoMs: 1000 });

  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    setAnimarBarra(false);
    const timer = setTimeout(() => {
      setAnimarBarra(true);
    }, 80);
    return () => {
      clearTimeout(timer);
    };
  }, [metricas.totalGeral, recarregando]);

  const kpis = [
    {
      id: '',
      label: 'Total',
      value: animTotal,
      description: 'Registros cadastrados',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      accent: 'accent',
    },
    {
      id: 'PENDENTE',
      label: 'Pendentes',
      value: animPendentes,
      description: 'Aguardando resposta',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: 'warning',
      ping: metricas.pendentes > 0,
    },
    {
      id: 'CONFIRMADO',
      label: 'Confirmados',
      value: animConfirmados,
      description: 'Consultas agendadas',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: 'success',
    },
    {
      id: 'ATENDIDO',
      label: 'Atendidos',
      value: animAtendidos,
      description: 'Procedimentos realizados',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      accent: 'info',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5 sm:gap-4">
        {kpis.map((kpi) => {
          const ativo = statusFiltro === kpi.id;
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => {
                onSelectStatus(kpi.id);
              }}
              className={cn(
                'flex flex-col justify-between rounded-card p-4 text-left transition-all border shadow-sm sm:p-5',
                ativo
                  ? 'bg-accent/10 border-accent ring-2 ring-accent/20'
                  : 'bg-surface border-default hover:border-hover hover:shadow-md',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                  {kpi.label}
                </span>
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-2xl',
                    kpi.accent === 'accent' && 'bg-accent/10 text-accent',
                    kpi.accent === 'warning' &&
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    kpi.accent === 'success' &&
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    kpi.accent === 'info' && 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
                  )}
                >
                  {kpi.icon}
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tabular-nums text-primary sm:text-3xl">
                    {kpi.value}
                  </span>
                  {'ping' in kpi && kpi.ping && (
                    <span className="h-2 w-2 rounded-full bg-warning animate-ping" />
                  )}
                </div>
                <p className="text-3xs text-muted font-medium mt-0.5">{kpi.description}</p>
              </div>
            </button>
          );
        })}

        <Link
          to="/admin/procedimentos"
          className="col-span-2 flex flex-col justify-between rounded-card border border-default bg-surface p-4 text-left transition-all shadow-sm hover:border-accent hover:shadow-md sm:p-5 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted">Catálogo</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-inset text-secondary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black tabular-nums text-primary sm:text-3xl">
              {animProcedimentos}
            </span>
            <p className="text-3xs text-muted font-medium mt-0.5">Serviços ativos na página</p>
          </div>
        </Link>
      </div>

      {metricas.totalGeral > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between text-2xs font-bold text-secondary">
            <span>Distribuição Geral de Status da Clínica</span>
            <span className="font-normal text-muted">
              {metricas.totalGeral} agendamentos registrados
            </span>
          </div>

          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-inset p-0.5 shadow-inner">
            {[
              {
                value: metricas.pendentes,
                color: 'from-amber-400 to-amber-500',
                rounded: 'rounded-l-full',
              },
              {
                value: metricas.confirmados,
                color: 'from-emerald-400 to-emerald-500',
                rounded: '',
              },
              { value: metricas.atendidos, color: 'from-cyan-400 to-cyan-500', rounded: '' },
              {
                value: metricas.cancelados,
                color: 'from-rose-400 to-rose-500',
                rounded: 'rounded-r-full',
              },
            ].map((segmento, idx) => {
              const width =
                metricas.totalGeral > 0 ? (segmento.value / metricas.totalGeral) * 100 : 0;
              const label = ['Pendentes', 'Confirmados', 'Atendidos', 'Cancelados'][idx];
              return segmento.value > 0 ? (
                <div
                  key={idx}
                  style={{ width: animarBarra ? `${String(width)}%` : '0%' }}
                  className={cn(
                    'h-full bg-gradient-to-r transition-all duration-1000 ease-out',
                    segmento.color,
                    segmento.rounded,
                  )}
                  title={`${label}: ${String(segmento.value)} (${width.toFixed(1)}%)`}
                />
              ) : null;
            })}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-4 text-2xs font-semibold text-secondary">
            <LegendItem color="bg-amber-500" label={`Pendente (${String(metricas.pendentes)})`} />
            <LegendItem
              color="bg-emerald-500"
              label={`Confirmado (${String(metricas.confirmados)})`}
            />
            <LegendItem color="bg-cyan-500" label={`Atendido (${String(metricas.atendidos)})`} />
            <LegendItem color="bg-rose-500" label={`Cancelado (${String(metricas.cancelados)})`} />
          </div>
        </Card>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }): ReactNode {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
      <span>{label}</span>
    </div>
  );
}
