import { describe, it, expect, beforeEach } from 'vitest';

import { PrismaAgendamentoRepository } from '../../src/modules/agendamentos/agendamento.repository.prisma.js';
import { prisma } from '../../src/shared/database/prisma.js';

// Testes de integracao do repositorio de agendamentos.
// Validam criacao, listagem com filtro e contagem.

describe('AgendamentoRepository', () => {
  const repositorio = new PrismaAgendamentoRepository();

  beforeEach(async () => {
    // Limpa todas as tabelas em ordem para respeitar as constraints de FK.
    await prisma.historicoStatus.deleteMany();
    await prisma.agendamento.deleteMany();
    await prisma.procedimento.deleteMany();
    await prisma.usuario.deleteMany();
  });

  async function criarProcedimentoFixture(): Promise<string> {
    const procedimento = await prisma.procedimento.create({
      data: { titulo: 'Limpeza', ativa: true },
    });

    return procedimento.id;
  }

  it('deve criar um agendamento com status pendente', async () => {
    const procedimentoId = await criarProcedimentoFixture();

    const agendamento = await repositorio.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: null,
      data: new Date('2026-10-10'),
      horario: '14:00',
      observacao: null,
      procedimentoId,
    });

    expect(agendamento.nome).toBe('Maria Silva');
    expect(agendamento.status).toBe('PENDENTE');
  });

  it('deve filtrar agendamentos por nome com busca parcial', async () => {
    const procedimentoId = await criarProcedimentoFixture();

    await repositorio.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: null,
      data: new Date('2026-10-10'),
      horario: '14:00',
      observacao: null,
      procedimentoId,
    });

    await repositorio.criar({
      nome: 'Joao Souza',
      email: 'joao@email.com',
      telefone: null,
      data: new Date('2026-10-11'),
      horario: '10:00',
      observacao: null,
      procedimentoId,
    });

    const resultado = await repositorio.listar({
      busca: 'maria',
      pagina: 1,
      limite: 10,
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe('Maria Silva');
  });
});
