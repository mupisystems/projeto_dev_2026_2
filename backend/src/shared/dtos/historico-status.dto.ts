import type { HistoricoStatus, StatusAgendamento } from '@prisma/client';

export interface HistoricoStatusDto {
  id: string;
  agendamentoId: string;
  statusAnterior: StatusAgendamento | null;
  statusNovo: StatusAgendamento;
  alteradoEm: string;
}

export function toHistoricoStatusDto(h: HistoricoStatus): HistoricoStatusDto {
  return {
    id: h.id,
    agendamentoId: h.agendamentoId,
    statusAnterior: h.statusAnterior,
    statusNovo: h.statusNovo,
    alteradoEm: h.alteradoEm instanceof Date ? h.alteradoEm.toISOString() : String(h.alteradoEm),
  };
}
