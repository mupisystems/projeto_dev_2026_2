import { randomUUID } from 'node:crypto';

import type { Agendamento, HistoricoStatus, StatusAgendamento } from '@prisma/client';

import { AppError } from '../../../../shared/errors/app-error.js';
import type {
  AgendamentoData,
  AgendamentoRepository,
  ContagemPorStatus,
} from '../../agendamento.repository.js';

// Repositorio in-memory para testes unitarios de agendamentos.
// Simula o banco em memoria RAM sem tocar no PostgreSQL.

export class InMemoryAgendamentoRepository implements AgendamentoRepository {
  private agendamentos: Agendamento[] = [];
  private historico: HistoricoStatus[] = [];

  async listar(params: {
    status?: StatusAgendamento;
    busca?: string;
    pagina: number;
    limite: number;
  }): Promise<Agendamento[]> {
    let resultado = this.agendamentos;

    if (params.status) {
      resultado = resultado.filter((a) => a.status === params.status);
    }

    if (params.busca) {
      const termo = params.busca.toLowerCase();
      resultado = resultado.filter(
        (a) => a.nome.toLowerCase().includes(termo) || a.email.toLowerCase().includes(termo),
      );
    }

    const skip = (params.pagina - 1) * params.limite;

    return resultado.slice(skip, skip + params.limite);
  }

  async contar(params: { status?: StatusAgendamento; busca?: string }): Promise<number> {
    let resultado = this.agendamentos;

    if (params.status) {
      resultado = resultado.filter((a) => a.status === params.status);
    }

    if (params.busca) {
      const termo = params.busca.toLowerCase();
      resultado = resultado.filter(
        (a) => a.nome.toLowerCase().includes(termo) || a.email.toLowerCase().includes(termo),
      );
    }

    return resultado.length;
  }

  async contarPorStatus(): Promise<ContagemPorStatus> {
    return {
      total: this.agendamentos.length,
      pendentes: this.agendamentos.filter((a) => a.status === 'PENDENTE').length,
      confirmados: this.agendamentos.filter((a) => a.status === 'CONFIRMADO').length,
      cancelados: this.agendamentos.filter((a) => a.status === 'CANCELADO').length,
      atendidos: this.agendamentos.filter((a) => a.status === 'ATENDIDO').length,
    };
  }

  async buscarPorId(id: string): Promise<(Agendamento & { historico: HistoricoStatus[] }) | null> {
    const agendamento = this.agendamentos.find((a) => a.id === id);

    if (!agendamento) {
      return null;
    }

    const historicoDoAgendamento = this.historico.filter((h) => h.agendamentoId === id);

    return { ...agendamento, historico: historicoDoAgendamento };
  }

  async existeAgendamento(email: string, data: Date, horario: string): Promise<boolean> {
    return this.agendamentos.some(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.data.getTime() === data.getTime() &&
        a.horario === horario,
    );
  }

  async criar(dados: AgendamentoData): Promise<Agendamento> {
    const jaExiste = this.agendamentos.some(
      (a) =>
        a.email.toLowerCase() === dados.email.toLowerCase() &&
        a.data.getTime() === dados.data.getTime() &&
        a.horario === dados.horario,
    );

    if (jaExiste) {
      throw new AppError('Ja existe um agendamento para este email no mesmo horario', 409);
    }

    const agendamento: Agendamento = {
      ...dados,
      id: randomUUID(),
      status: 'PENDENTE',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    this.agendamentos.push(agendamento);

    return agendamento;
  }

  async atualizarStatus(
    id: string,
    status: StatusAgendamento,
    statusAnterior: StatusAgendamento,
  ): Promise<Agendamento> {
    const indice = this.agendamentos.findIndex((a) => a.id === id);

    if (indice === -1) {
      throw new Error(`Agendamento nao encontrado: ${id}`);
    }

    this.historico.push({
      id: randomUUID(),
      agendamentoId: id,
      statusAnterior,
      statusNovo: status,
      alteradoEm: new Date(),
    });

    this.agendamentos[indice] = {
      ...this.agendamentos[indice],
      status,
      atualizadoEm: new Date(),
    };

    return this.agendamentos[indice];
  }
}
