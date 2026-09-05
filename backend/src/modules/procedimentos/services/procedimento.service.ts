import type { Procedimento } from '@prisma/client';

import { AppError } from '../../../shared/errors/app-error.js';
import type {
  AtualizarProcedimentoInput,
  CriarProcedimentoInput,
} from '../../../shared/schemas/procedimento.schema.js';
import type { ProcedimentoRepository } from '../procedimento.repository.js';

// Service centraliza a logica de negocio de procedimentos.
// Depende da interface do repositorio, nao da implementacao Prisma.

export class ProcedimentoService {
  constructor(private readonly repository: ProcedimentoRepository) {}

  async listarAtivos(): Promise<Procedimento[]> {
    return this.repository.listarAtivos();
  }

  async listarTodos(): Promise<Procedimento[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: string): Promise<Procedimento | null> {
    return this.repository.buscarPorId(id);
  }

  async criar(input: CriarProcedimentoInput): Promise<Procedimento> {
    return this.repository.criar({
      titulo: input.titulo,
      ativa: input.ativa,
      preco: input.preco ?? null,
      duracaoMinutos: input.duracaoMinutos ?? null,
    });
  }

  async atualizar(id: string, input: AtualizarProcedimentoInput): Promise<Procedimento> {
    const procedimento = await this.repository.buscarPorId(id);

    if (!procedimento) {
      throw new AppError('Procedimento nao encontrado', 404);
    }

    return this.repository.atualizar(id, {
      titulo: input.titulo,
      ativa: input.ativa,
      preco: input.preco,
      duracaoMinutos: input.duracaoMinutos,
    });
  }

  async desativar(id: string): Promise<Procedimento> {
    return this.repository.atualizar(id, { ativa: false });
  }
}
