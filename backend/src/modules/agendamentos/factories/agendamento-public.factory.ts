import { PrismaProcedimentoRepository } from '../../procedimentos/procedimento.repository.prisma.js';
import { PrismaAgendamentoRepository } from '../agendamento.repository.prisma.js';
import { AgendamentoPublicController } from '../controllers/agendamento-public.controller.js';
import { AgendamentoService } from '../services/agendamento.service.js';

// Factory centraliza a criacao do controller publico de agendamentos.
// Mantem a rota livre de logica de composicao de dependencias.

export function criarAgendamentoPublicController(): AgendamentoPublicController {
  const agendamentoRepository = new PrismaAgendamentoRepository();
  const procedimentoRepository = new PrismaProcedimentoRepository();
  const agendamentoService = new AgendamentoService(agendamentoRepository, procedimentoRepository);

  return new AgendamentoPublicController(agendamentoService);
}
