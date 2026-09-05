import type { Agendamento, Procedimento, StatusAgendamento } from '@prisma/client';

import type { AgendamentoComHistorico } from '../../modules/agendamentos/agendamento.repository.js';

import { type HistoricoStatusDto, toHistoricoStatusDto } from './historico-status.dto.js';
import { type ProcedimentoDto, toProcedimentoDto } from './procedimento.dto.js';

export interface AgendamentoDto {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  data: string;
  horario: string;
  status: StatusAgendamento;
  observacao: string | null;
  procedimentoId: string;
  procedimento?: ProcedimentoDto;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AgendamentoDetalheDto extends AgendamentoDto {
  historico: HistoricoStatusDto[];
}

export function toAgendamentoDto(
  a: Agendamento & { procedimento?: Procedimento | null },
): AgendamentoDto {
  return {
    id: a.id,
    nome: a.nome,
    email: a.email,
    telefone: a.telefone,
    data: a.data instanceof Date ? a.data.toISOString() : String(a.data),
    horario: a.horario,
    status: a.status,
    observacao: a.observacao,
    procedimentoId: a.procedimentoId,
    procedimento: a.procedimento ? toProcedimentoDto(a.procedimento) : undefined,
    criadoEm: a.criadoEm instanceof Date ? a.criadoEm.toISOString() : String(a.criadoEm),
    atualizadoEm:
      a.atualizadoEm instanceof Date ? a.atualizadoEm.toISOString() : String(a.atualizadoEm),
  };
}

export function toAgendamentoDetalheDto(a: AgendamentoComHistorico): AgendamentoDetalheDto {
  return {
    ...toAgendamentoDto(a),
    historico: a.historico.map(toHistoricoStatusDto),
  };
}
