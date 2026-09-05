import { describe, it, expect, beforeEach } from 'vitest';

import { PrismaProcedimentoRepository } from '../../src/modules/procedimentos/procedimento.repository.prisma.js';
import { prisma } from '../../src/shared/database/prisma.js';

// Testes de integracao do repositorio de procedimentos.
// Validam a comunicacao real com o banco PostgreSQL.

describe('ProcedimentoRepository', () => {
  const repositorio = new PrismaProcedimentoRepository();

  beforeEach(async () => {
    // Limpa todas as tabelas em ordem para respeitar as constraints de FK.
    await prisma.historicoStatus.deleteMany();
    await prisma.agendamento.deleteMany();
    await prisma.procedimento.deleteMany();
  });

  it('deve criar e listar procedimentos ativos', async () => {
    await repositorio.criar({
      titulo: 'Limpeza',
      ativa: true,
      preco: 150.0,
      duracaoMinutos: 45,
    });

    const ativos = await repositorio.listarAtivos();

    expect(ativos).toHaveLength(1);
    expect(ativos[0].titulo).toBe('Limpeza');
  });

  it('nao deve listar procedimentos inativos', async () => {
    await repositorio.criar({
      titulo: 'Limpeza',
      ativa: false,
      preco: 150.0,
      duracaoMinutos: 45,
    });

    const ativos = await repositorio.listarAtivos();

    expect(ativos).toHaveLength(0);
  });
});
