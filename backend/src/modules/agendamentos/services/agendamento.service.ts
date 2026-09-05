import type { Agendamento, StatusAgendamento } from '@prisma/client';

import { AppError } from '../../../shared/errors/app-error.js';
import type {
  AtualizarStatusAgendamentoInput,
  CriarAgendamentoInput,
  ListarAgendamentosInput,
} from '../../../shared/schemas/agendamento.schema.js';
import type { ProcedimentoRepository } from '../../procedimentos/procedimento.repository.js';
import type {
  AgendamentoComHistorico,
  AgendamentoRepository,
  ContagemPorStatus,
} from '../agendamento.repository.js';

// Service centraliza a logica de negocio de agendamentos.
// Depende das interfaces dos repositorios, nao das implementacoes Prisma.

export class AgendamentoService {
  constructor(
    private readonly agendamentoRepository: AgendamentoRepository,
    private readonly procedimentoRepository: ProcedimentoRepository,
  ) {}

  async criar(input: CriarAgendamentoInput): Promise<Agendamento> {
    const procedimento = await this.procedimentoRepository.buscarPorId(input.procedimentoId);

    if (!procedimento || !procedimento.ativa) {
      throw new AppError('Procedimento nao encontrado ou inativo', 404);
    }

    this.validarDataFutura(input.data);

    const jaExiste = await this.agendamentoRepository.existeAgendamento(
      input.email,
      input.data,
      input.horario,
    );

    if (jaExiste) {
      throw new AppError('Ja existe um agendamento para este email no mesmo horario', 409);
    }

    // Status inicial sempre pendente, mesmo se outro valor for enviado.
    return this.agendamentoRepository.criar({
      nome: input.nome,
      email: input.email,
      telefone: input.telefone ?? null,
      data: input.data,
      horario: input.horario,
      observacao: input.observacao ?? null,
      procedimentoId: input.procedimentoId,
    });
  }

  async listar(
    input: ListarAgendamentosInput,
  ): Promise<{ agendamentos: Agendamento[]; total: number }> {
    const [agendamentos, total] = await Promise.all([
      this.agendamentoRepository.listar({
        status: input.status,
        busca: input.busca,
        pagina: input.pagina,
        limite: input.limite,
      }),
      this.agendamentoRepository.contar({
        status: input.status,
        busca: input.busca,
      }),
    ]);

    return { agendamentos, total };
  }

  async contarPorStatus(): Promise<ContagemPorStatus> {
    return this.agendamentoRepository.contarPorStatus();
  }

  async buscarPorId(id: string): Promise<AgendamentoComHistorico> {
    const agendamento = await this.agendamentoRepository.buscarPorId(id);

    if (!agendamento) {
      throw new AppError('Agendamento nao encontrado', 404);
    }

    return agendamento;
  }

  async atualizarStatus(id: string, input: AtualizarStatusAgendamentoInput): Promise<Agendamento> {
    const agendamento = await this.buscarPorId(id);

    // Valida transicoes permitidas entre status.
    this.validarTransicao(agendamento.status, input.status);

    return this.agendamentoRepository.atualizarStatus(id, input.status, agendamento.status);
  }

  private validarTransicao(atual: StatusAgendamento, novo: StatusAgendamento): void {
    if (atual === novo) {
      return;
    }

    if (atual === 'CANCELADO') {
      throw new AppError('Nao e possivel alterar o status de um agendamento cancelado', 409);
    }

    if (atual === 'ATENDIDO') {
      throw new AppError('Nao e possivel alterar o status de um agendamento ja atendido', 409);
    }

    if (novo === 'ATENDIDO' && atual !== 'CONFIRMADO') {
      throw new AppError('Somente agendamentos confirmados podem ser atendidos', 409);
    }
  }

  private validarDataFutura(data: Date): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataAgendamento = new Date(data);
    dataAgendamento.setHours(0, 0, 0, 0);

    if (dataAgendamento.getTime() < hoje.getTime()) {
      throw new AppError('Nao e possivel agendar para uma data no passado', 400);
    }
  }
}
