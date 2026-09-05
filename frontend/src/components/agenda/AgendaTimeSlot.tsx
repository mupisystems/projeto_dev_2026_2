import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import type {
  AgendamentoAdmin,
  Procedimento,
  StatusAgendamento,
} from '../../services/admin.service';
import { Badge } from '../ui/Badge';

import { AgendaAppointmentCard } from './AgendaAppointmentCard';
import { verificarSlotPassado } from './utils';

interface AgendaTimeSlotProps {
  slot: string;
  dataSelecionada: string;
  agendamentos: AgendamentoAdmin[];
  procedimentos: Procedimento[];
  filtroStatus: string;
  onStatusChange: (id: string, status: StatusAgendamento) => void;
}

export function AgendaTimeSlot({
  slot,
  dataSelecionada,
  agendamentos,
  procedimentos,
  filtroStatus,
  onStatusChange,
}: AgendaTimeSlotProps): ReactNode {
  const ocupado = agendamentos.length > 0;
  const isPassado = verificarSlotPassado(dataSelecionada, slot);
  const isPrimeiroTarde = slot === '13:00';

  return (
    <div>
      {/* Divisor do Intervalo de Almoço */}
      {isPrimeiroTarde && (
        <div className="my-6 flex items-center justify-center gap-3 py-2 border-y border-dashed border-subtle">
          <span className="flex items-center gap-2 text-xs font-bold text-muted">
            <svg
              className="h-4 w-4 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Intervalo de Almoço da Equipe (12:00 às 13:00)
          </span>
        </div>
      )}

      <div
        className={cn(
          'flex flex-col md:flex-row md:items-stretch gap-3 rounded-2xl p-3 sm:p-4 transition-all',
          ocupado
            ? 'bg-inset/80 border border-default'
            : 'border border-dashed border-subtle hover:border-default hover:bg-inset/40',
        )}
      >
        {/* Horário Slot */}
        <div className="flex md:flex-col items-center justify-between md:justify-center md:w-24 shrink-0 pr-0 md:pr-4 md:border-r border-subtle">
          <span className="text-base font-black text-primary tabular-nums">{slot}</span>
          <span
            className={cn(
              'text-3xs font-bold uppercase tracking-wider',
              ocupado && 'text-accent',
              isPassado && !ocupado && 'text-muted',
              !ocupado && !isPassado && 'text-success',
            )}
          >
            {ocupado
              ? `${String(agendamentos.length)} ${
                  agendamentos.length === 1 ? 'consulta' : 'consultas'
                }`
              : isPassado
                ? 'Encerrado'
                : 'Livre'}
          </span>
        </div>

        {/* Conteúdo do Slot */}
        <div className="flex-1">
          {ocupado ? (
            <div className="space-y-2">
              {agendamentos.map((ag) => (
                <AgendaAppointmentCard
                  key={ag.id}
                  agendamento={ag}
                  procedimentos={procedimentos}
                  filtroStatus={filtroStatus}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          ) : isPassado ? (
            <div className="flex items-center justify-between py-1 text-xs text-muted">
              <span>Nenhum agendamento registrado</span>
              <Badge variant="neutral" className="gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Horário Passado
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between py-1 text-xs text-muted">
              <span>Horário disponível para atendimento</span>
              <Badge variant="success">✓ Disponível</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
