import { ProcedimentoAdminController } from '../controllers/procedimento-admin.controller.js';
import { PrismaProcedimentoRepository } from '../procedimento.repository.prisma.js';
import { ProcedimentoService } from '../services/procedimento.service.js';

// Factory centraliza a criacao do controller administrativo de procedimentos.
// Mantem a rota livre de logica de composicao de dependencias.

export function criarProcedimentoAdminController(): ProcedimentoAdminController {
  const repository = new PrismaProcedimentoRepository();
  const procedimentoService = new ProcedimentoService(repository);

  return new ProcedimentoAdminController(procedimentoService);
}
