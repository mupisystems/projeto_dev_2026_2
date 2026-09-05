import type { Procedimento } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library.js';

import { prisma } from '../../shared/database/prisma.js';

import type { ProcedimentoData, ProcedimentoRepository } from './procedimento.repository.js';

// Implementacao do repositorio usando Prisma ORM.
// A instancia do Prisma vem de um unico ponto de configuracao.

export class PrismaProcedimentoRepository implements ProcedimentoRepository {
  async listarAtivos(): Promise<Procedimento[]> {
    return prisma.procedimento.findMany({
      where: { ativa: true },
      orderBy: { criadoEm: 'asc' },
    });
  }

  async listarTodos(): Promise<Procedimento[]> {
    return prisma.procedimento.findMany({
      orderBy: { criadoEm: 'asc' },
    });
  }

  async buscarPorId(id: string): Promise<Procedimento | null> {
    return prisma.procedimento.findUnique({
      where: { id },
    });
  }

  async criar(dados: ProcedimentoData): Promise<Procedimento> {
    return prisma.procedimento.create({
      data: {
        ...dados,
        preco: dados.preco === null ? null : new Decimal(dados.preco),
      },
    });
  }

  async atualizar(id: string, dados: Partial<ProcedimentoData>): Promise<Procedimento> {
    return prisma.procedimento.update({
      where: { id },
      data: {
        ...dados,
        preco:
          dados.preco === undefined
            ? undefined
            : dados.preco === null
              ? null
              : new Decimal(dados.preco),
      },
    });
  }
}
