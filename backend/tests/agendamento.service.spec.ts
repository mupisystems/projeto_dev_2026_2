import { describe, it, expect, beforeEach, vi } from 'vitest';

import { InMemoryAgendamentoRepository } from '../src/modules/agendamentos/repositories/in-memory/agendamento.repository.in-memory.js';
import { AgendamentoService } from '../src/modules/agendamentos/services/agendamento.service.js';
import { InMemoryProcedimentoRepository } from '../src/modules/procedimentos/repositories/in-memory/procedimento.repository.in-memory.js';
import { AppError } from '../src/shared/errors/app-error.js';

// Testes unitarios do service de agendamentos.
// Validam regras de negocio usando repositorios in-memory.

describe('AgendamentoService', () => {
  let agendamentoRepository: InMemoryAgendamentoRepository;
  let procedimentoRepository: InMemoryProcedimentoRepository;
  let service: AgendamentoService;

  beforeEach(() => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    procedimentoRepository = new InMemoryProcedimentoRepository();
    service = new AgendamentoService(agendamentoRepository, procedimentoRepository);
  });

  async function criarProcedimentoAtivo(): Promise<{ id: string }> {
    return procedimentoRepository.criar({
      titulo: 'Limpeza',
      ativa: true,
      preco: 150,
      duracaoMinutos: 45,
    });
  }

  it('deve criar um agendamento com status pendente', async () => {
    const procedimento = await criarProcedimentoAtivo();

    const agendamento = await service.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      data: new Date('2026-10-10'),
      horario: '14:00',
      procedimentoId: procedimento.id,
    });

    expect(agendamento.nome).toBe('Maria Silva');
    expect(agendamento.status).toBe('PENDENTE');
  });

  it('deve recusar agendamento com procedimento inativo', async () => {
    const procedimento = await procedimentoRepository.criar({
      titulo: 'Limpeza',
      ativa: false,
      preco: 150,
      duracaoMinutos: 45,
    });

    await expect(
      service.criar({
        nome: 'Maria Silva',
        email: 'maria@email.com',
        data: new Date('2026-10-10'),
        horario: '14:00',
        procedimentoId: procedimento.id,
      }),
    ).rejects.toThrow(AppError);
  });

  it('deve recusar agendamento duplicado no mesmo horario', async () => {
    const procedimento = await criarProcedimentoAtivo();

    await service.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      data: new Date('2026-10-10'),
      horario: '14:00',
      procedimentoId: procedimento.id,
    });

    await expect(
      service.criar({
        nome: 'Maria Outra',
        email: 'maria@email.com',
        data: new Date('2026-10-10'),
        horario: '14:00',
        procedimentoId: procedimento.id,
      }),
    ).rejects.toThrow('Ja existe um agendamento para este email no mesmo horario');
  });

  it('deve propagar erro 409 caso ocorra race condition no repositorio', async () => {
    const procedimento = await criarProcedimentoAtivo();

    // Simula race condition onde a checagem previa passa, mas o repositorio lanca 409
    vi.spyOn(agendamentoRepository, 'existeAgendamento').mockResolvedValueOnce(false);
    vi.spyOn(agendamentoRepository, 'criar').mockRejectedValueOnce(
      new AppError('Ja existe um agendamento para este email no mesmo horario', 409),
    );

    await expect(
      service.criar({
        nome: 'Maria Outra',
        email: 'maria@email.com',
        data: new Date('2026-10-10'),
        horario: '14:00',
        procedimentoId: procedimento.id,
      }),
    ).rejects.toThrow(
      new AppError('Ja existe um agendamento para este email no mesmo horario', 409),
    );
  });

  it('deve confirmar e depois atender um agendamento', async () => {
    const procedimento = await criarProcedimentoAtivo();

    const agendamento = await service.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      data: new Date('2026-10-10'),
      horario: '14:00',
      procedimentoId: procedimento.id,
    });

    const confirmado = await service.atualizarStatus(agendamento.id, { status: 'CONFIRMADO' });
    expect(confirmado.status).toBe('CONFIRMADO');

    const atendido = await service.atualizarStatus(agendamento.id, { status: 'ATENDIDO' });
    expect(atendido.status).toBe('ATENDIDO');
  });

  it('deve recusar atender agendamento nao confirmado', async () => {
    const procedimento = await criarProcedimentoAtivo();

    const agendamento = await service.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      data: new Date('2026-10-10'),
      horario: '14:00',
      procedimentoId: procedimento.id,
    });

    await expect(service.atualizarStatus(agendamento.id, { status: 'ATENDIDO' })).rejects.toThrow(
      'Somente agendamentos confirmados podem ser atendidos',
    );
  });

  it('deve recusar alterar status de agendamento cancelado', async () => {
    const procedimento = await criarProcedimentoAtivo();

    const agendamento = await service.criar({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      data: new Date('2026-10-10'),
      horario: '14:00',
      procedimentoId: procedimento.id,
    });

    await service.atualizarStatus(agendamento.id, { status: 'CANCELADO' });

    await expect(service.atualizarStatus(agendamento.id, { status: 'CONFIRMADO' })).rejects.toThrow(
      'Nao e possivel alterar o status de um agendamento cancelado',
    );
  });

  it('deve listar agendamentos com paginacao', async () => {
    const procedimento = await criarProcedimentoAtivo();

    await service.criar({
      nome: 'Primeiro',
      email: 'primeiro@email.com',
      data: new Date('2026-10-10'),
      horario: '08:00',
      procedimentoId: procedimento.id,
    });

    await service.criar({
      nome: 'Segundo',
      email: 'segundo@email.com',
      data: new Date('2026-10-11'),
      horario: '09:00',
      procedimentoId: procedimento.id,
    });

    const resultado = await service.listar({ pagina: 1, limite: 1 });

    expect(resultado.agendamentos).toHaveLength(1);
    expect(resultado.total).toBe(2);
  });

  it('deve contar agendamentos por status agregados', async () => {
    const procedimento = await criarProcedimentoAtivo();

    await service.criar({
      nome: 'Pendente',
      email: 'p@email.com',
      data: new Date('2026-10-10'),
      horario: '08:00',
      procedimentoId: procedimento.id,
    });

    const a2 = await service.criar({
      nome: 'Confirmado',
      email: 'c@email.com',
      data: new Date('2026-10-10'),
      horario: '09:00',
      procedimentoId: procedimento.id,
    });
    await service.atualizarStatus(a2.id, { status: 'CONFIRMADO' });

    const contagem = await service.contarPorStatus();

    expect(contagem).toEqual({
      total: 2,
      pendentes: 1,
      confirmados: 1,
      cancelados: 0,
      atendidos: 0,
    });
  });
});
