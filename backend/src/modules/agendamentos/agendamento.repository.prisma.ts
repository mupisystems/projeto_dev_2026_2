import { Prisma, type Agendamento, type StatusAgendamento } from '@prisma/client';

import { prisma } from '../../shared/database/prisma.js';
import { AppError } from '../../shared/errors/app-error.js';

import type {
  AgendamentoComHistorico,
  AgendamentoData,
  AgendamentoRepository,
  ContagemPorStatus,
} from './agendamento.repository.js';

// Implementação do repositório de agendamentos com Prisma.
// Filtros de busca e paginação ficam centralizados aqui.

export class PrismaAgendamentoRepository implements AgendamentoRepository {
  async listar(params: {
    status?: StatusAgendamento;
    busca?: string;
    pagina: number;
    limite: number;
  }): Promise<Agendamento[]> {
    const skip = (params.pagina - 1) * params.limite;

    return prisma.agendamento.findMany({
      where: this.montarWhere(params.status, params.busca),
      orderBy: [{ data: 'asc' }, { horario: 'asc' }],
      skip,
      take: params.limite,
      include: { procedimento: true },
    });
  }

  async contar(params: { status?: StatusAgendamento; busca?: string }): Promise<number> {
    return prisma.agendamento.count({
      where: this.montarWhere(params.status, params.busca),
    });
  }

  async contarPorStatus(): Promise<ContagemPorStatus> {
    const [total, porStatus] = await Promise.all([
      prisma.agendamento.count(),
      prisma.agendamento.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const mapa = new Map(porStatus.map((item) => [item.status, item._count.status]));

    return {
      total,
      pendentes: mapa.get('PENDENTE') ?? 0,
      confirmados: mapa.get('CONFIRMADO') ?? 0,
      cancelados: mapa.get('CANCELADO') ?? 0,
      atendidos: mapa.get('ATENDIDO') ?? 0,
    };
  }

  async buscarPorId(id: string): Promise<AgendamentoComHistorico | null> {
    return prisma.agendamento.findUnique({
      where: { id },
      include: { procedimento: true, historico: { orderBy: { alteradoEm: 'asc' } } },
    });
  }

  async existeAgendamento(email: string, data: Date, horario: string): Promise<boolean> {
    const count = await prisma.agendamento.count({
      where: {
        email: { equals: email, mode: 'insensitive' },
        data,
        horario,
      },
    });

    return count > 0;
  }

  async criar(dados: AgendamentoData): Promise<Agendamento> {
    try {
      return await prisma.agendamento.create({
        data: this.normalizarCamposOpcionais(dados),
        include: { procedimento: true },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('Ja existe um agendamento para este email no mesmo horario', 409);
      }

      throw error;
    }
  }

  private normalizarCamposOpcionais(
    dados: AgendamentoData,
  ): Prisma.AgendamentoUncheckedCreateInput {
    return {
      ...dados,
      telefone: dados.telefone ?? null,
      observacao: dados.observacao ?? null,
    };
  }

  async atualizarStatus(
    id: string,
    status: StatusAgendamento,
    statusAnterior: StatusAgendamento,
  ): Promise<Agendamento> {
    return prisma.agendamento.update({
      where: { id },
      data: {
        status,
        historico: {
          create: {
            statusAnterior,
            statusNovo: status,
          },
        },
      },
      include: { procedimento: true },
    });
  }

  private montarWhere(status?: StatusAgendamento, busca?: string): Prisma.AgendamentoWhereInput {
    const where: Prisma.AgendamentoWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
