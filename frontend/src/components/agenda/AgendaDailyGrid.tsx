import type { ReactNode } from 'react';

import type {
  AgendamentoAdmin,
  Procedimento,
  StatusAgendamento,
} from '../../services/admin.service';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { AgendaGridSkeleton } from '../ui/Skeleton';

import { AgendaTimeSlot } from './AgendaTimeSlot';
import { TODOS_HORARIOS_SLOTS } from './utils';

interface AgendaDailyGridProps {
  totalAtendimentos: number;
  carregando: boolean;
  temAgendamentos: boolean;
  dataSelecionada: string;
  mapaHorarios: Map<string, AgendamentoAdmin[]>;
  procedimentos: Procedimento[];
  filtroStatus: string;
  onStatusChange: (id: string, status: StatusAgendamento) => void;
}

export function AgendaDailyGrid({
  totalAtendimentos,
  carregando,
  temAgendamentos,
  dataSelecionada,
  mapaHorarios,
  procedimentos,
  filtroStatus,
  onStatusChange,
}: AgendaDailyGridProps): ReactNode {
  return (
    <Card variant="elevated" className="p-5 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-subtle pb-4">
        <div>
          <h2 className="text-base font-black text-primary flex items-center gap-2">
            <span>Grade de Atendimento do Dia</span>
            <Badge variant="neutral">{totalAtendimentos} atendimento(s)</Badge>
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Horários estruturados das 08:00 às 19:00 com ações e contato direto.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Confirmado
          </span>
          <span className="flex items-center gap-1.5 text-warning">
            <span className="h-2 w-2 rounded-full bg-warning" /> Pendente
          </span>
          <span className="flex items-center gap-1.5 text-info">
            <span className="h-2 w-2 rounded-full bg-info" /> Atendido
          </span>
        </div>
      </div>

      {carregando && !temAgendamentos ? (
        <AgendaGridSkeleton count={8} />
      ) : (
        <div className="space-y-3">
          {TODOS_HORARIOS_SLOTS.map((slot) => (
            <AgendaTimeSlot
              key={slot}
              slot={slot}
              dataSelecionada={dataSelecionada}
              agendamentos={mapaHorarios.get(slot) || []}
              procedimentos={procedimentos}
              filtroStatus={filtroStatus}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
