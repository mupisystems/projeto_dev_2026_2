import type { Request, RequestHandler, Response } from 'express';

import { toProcedimentoDto } from '../../../shared/dtos/index.js';
import type { ProcedimentoService } from '../services/procedimento.service.js';

// Controller publico de procedimentos.
// Expor apenas a listagem de procedimentos ativos para a pagina publica.
// Erros de dominio sao tratados pelo middleware global de erros.

export class ProcedimentoPublicController {
  constructor(private readonly procedimentoService: ProcedimentoService) {}

  listarAtivos: RequestHandler = async (_request: Request, response: Response): Promise<void> => {
    const procedimentos = await this.procedimentoService.listarAtivos();

    response.json(procedimentos.map(toProcedimentoDto));
  };
}
