import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import type { AgendamentoAdmin } from '../../services/admin.service';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

export interface DiaSemanaItem {
  dataIso: string;
  dataObj: Date;
  nomeDia: string;
  diaMes: string;
  agendamentos: AgendamentoAdmin[];
  isSelecionado: boolean;
  isHoje: boolean;
}

interface AgendaWeeklyViewProps {
  diasDaSemana: DiaSemanaItem[];
  onSelectDia: (dataIso: string) => void;
}

export function AgendaWeeklyView({ diasDaSemana, onSelectDia }: AgendaWeeklyViewProps): ReactNode {
  return (
    <Card variant="elevated" className="p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between border-b border-subtle pb-4">
        <div>
          <h2 className="text-base font-black text-primary">Visão Semanal de Agendamentos</h2>
          <p className="text-xs text-secondary mt-0.5">
            Acompanhe a distribuição de pacientes ao longo dos 7 dias da semana.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {diasDaSemana.map((dia) => (
          <Card
            key={dia.dataIso}
            variant={dia.isSelecionado ? 'outlined' : 'default'}
            className={cn(
              'cursor-pointer p-3.5 transition-all',
              dia.isSelecionado && 'border-accent ring-2 ring-accent/20',
            )}
            onClick={() => {
              onSelectDia(dia.dataIso);
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-muted">{dia.nomeDia}</span>
              {dia.isHoje && <span className="rounded-full bg-success h-2 w-2" title="Hoje" />}
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <span className="text-lg font-black text-primary">{dia.diaMes}</span>
              <Badge
                variant={dia.agendamentos.length > 0 ? 'primary' : 'neutral'}
                className="text-3xs"
              >
                {dia.agendamentos.length}
              </Badge>
            </div>

            <div className="space-y-1.5 min-h-[140px]">
              {dia.agendamentos.length === 0 ? (
                <EmptyState
                  title=""
                  description="Sem consultas"
                  className="py-0"
                  icon={<div className="h-4 w-4" />}
                />
              ) : (
                dia.agendamentos.slice(0, 4).map((ag) => (
                  <div
                    key={ag.id}
                    className="rounded-xl border border-subtle bg-inset p-2 text-left text-xs transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary truncate max-w-[90px]">
                        {ag.nome.split(' ')[0]}
                      </span>
                      <span className="text-3xs font-bold text-muted tabular-nums">
                        {ag.horario}
                      </span>
                    </div>
                    <span className="block text-3xs text-accent truncate">
                      {ag.procedimento?.titulo ?? 'Consulta'}
                    </span>
                  </div>
                ))
              )}

              {dia.agendamentos.length > 4 && (
                <span className="block text-center text-3xs font-bold text-muted">
                  + {dia.agendamentos.length - 4} mais
                </span>
              )}
            </div>

            <Button type="button" variant="secondary" size="sm" className="mt-3 w-full">
              Abrir Grade
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}
