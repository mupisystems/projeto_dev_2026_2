import { ProcedimentoPublicController } from '../controllers/procedimento-public.controller.js';
import { PrismaProcedimentoRepository } from '../procedimento.repository.prisma.js';
import { ProcedimentoService } from '../services/procedimento.service.js';

// Factory centraliza a criacao do controller publico de procedimentos.
// Mantem a rota livre de logica de composicao de dependencias.

export function criarProcedimentoPublicController(): ProcedimentoPublicController {
  const repository = new PrismaProcedimentoRepository();
  const procedimentoService = new ProcedimentoService(repository);

  return new ProcedimentoPublicController(procedimentoService);
}
