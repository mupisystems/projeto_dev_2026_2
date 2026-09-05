import { randomUUID } from 'node:crypto';

import type { Procedimento } from '@prisma/client';

import type { ProcedimentoData, ProcedimentoRepository } from '../../procedimento.repository.js';

// Repositorio in-memory para testes unitarios de procedimentos.
// Substitui o Prisma em memoria RAM, sem persistencia.

export class InMemoryProcedimentoRepository implements ProcedimentoRepository {
  private procedimentos: Procedimento[] = [];

  async listarAtivos(): Promise<Procedimento[]> {
    return this.procedimentos.filter((p) => p.ativa);
  }

  async listarTodos(): Promise<Procedimento[]> {
    return this.procedimentos;
  }

  async buscarPorId(id: string): Promise<Procedimento | null> {
    return this.procedimentos.find((p) => p.id === id) ?? null;
  }

  async criar(dados: ProcedimentoData): Promise<Procedimento> {
    const procedimento = {
      ...dados,
      id: randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    } as Procedimento;

    this.procedimentos.push(procedimento);

    return procedimento;
  }

  async atualizar(id: string, dados: Partial<ProcedimentoData>): Promise<Procedimento> {
    const indice = this.procedimentos.findIndex((p) => p.id === id);

    if (indice === -1) {
      throw new Error(`Procedimento nao encontrado: ${id}`);
    }

    this.procedimentos[indice] = {
      ...this.procedimentos[indice],
      ...dados,
      atualizadoEm: new Date(),
    } as Procedimento;

    return this.procedimentos[indice];
  }
}
