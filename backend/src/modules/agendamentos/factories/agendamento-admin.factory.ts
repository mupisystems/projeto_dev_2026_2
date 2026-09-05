import { PrismaProcedimentoRepository } from '../../procedimentos/procedimento.repository.prisma.js';
import { PrismaAgendamentoRepository } from '../agendamento.repository.prisma.js';
import { AgendamentoAdminController } from '../controllers/agendamento-admin.controller.js';
import { AgendamentoService } from '../services/agendamento.service.js';

// Factory centraliza a criacao do controller administrativo de agendamentos.
// Mantem a rota livre de logica de composicao de dependencias.

export function criarAgendamentoAdminController(): AgendamentoAdminController {
  const agendamentoRepository = new PrismaAgendamentoRepository();
  const procedimentoRepository = new PrismaProcedimentoRepository();
  const agendamentoService = new AgendamentoService(agendamentoRepository, procedimentoRepository);

  return new AgendamentoAdminController(agendamentoService);
}
