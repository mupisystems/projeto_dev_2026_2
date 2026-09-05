import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryProcedimentoRepository } from '../src/modules/procedimentos/repositories/in-memory/procedimento.repository.in-memory.js';
import { ProcedimentoService } from '../src/modules/procedimentos/services/procedimento.service.js';

// Testes unitarios do service de procedimentos.
// Usam repositorio in-memory para validar regras de negocio sem tocar no banco.

describe('ProcedimentoService', () => {
  let repository: InMemoryProcedimentoRepository;
  let service: ProcedimentoService;

  beforeEach(() => {
    repository = new InMemoryProcedimentoRepository();
    service = new ProcedimentoService(repository);
  });

  it('deve criar um procedimento ativo', async () => {
    const procedimento = await service.criar({
      titulo: 'Limpeza',
      ativa: true,
      preco: 150,
      duracaoMinutos: 45,
    });

    expect(procedimento.titulo).toBe('Limpeza');
    expect(procedimento.ativa).toBe(true);
  });

  it('deve listar apenas procedimentos ativos', async () => {
    await service.criar({ titulo: 'Ativo', ativa: true, preco: 100, duracaoMinutos: 30 });
    await service.criar({ titulo: 'Inativo', ativa: false, preco: 100, duracaoMinutos: 30 });

    const ativos = await service.listarAtivos();

    expect(ativos).toHaveLength(1);
    expect(ativos[0].titulo).toBe('Ativo');
  });

  it('deve atualizar um procedimento existente', async () => {
    const criado = await service.criar({
      titulo: 'Limpeza',
      ativa: true,
      preco: 150,
      duracaoMinutos: 45,
    });

    const atualizado = await service.atualizar(criado.id, {
      titulo: 'Limpeza Premium',
      preco: 200,
    });

    expect(atualizado.titulo).toBe('Limpeza Premium');
    expect(atualizado.preco).toBe(200);
  });

  it('deve lancar erro ao atualizar procedimento inexistente', async () => {
    await expect(service.atualizar('id-inexistente', { titulo: 'Novo' })).rejects.toThrow(
      'Procedimento nao encontrado',
    );
  });
});
