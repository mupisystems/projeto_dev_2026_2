import type { Request, RequestHandler, Response } from 'express';

import { toProcedimentoDto } from '../../../shared/dtos/index.js';
import type { ProcedimentoService } from '../services/procedimento.service.js';

// Controller administrativo de procedimentos.
// Permite criar, listar e atualizar procedimentos no painel de gestao.
// Erros de dominio sao tratados pelo middleware global de erros.

export class ProcedimentoAdminController {
  constructor(private readonly procedimentoService: ProcedimentoService) {}

  listarTodos: RequestHandler = async (_request: Request, response: Response): Promise<void> => {
    const procedimentos = await this.procedimentoService.listarTodos();

    response.json(procedimentos.map(toProcedimentoDto));
  };

  criar: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const procedimento = await this.procedimentoService.criar(request.body);

    response.status(201).json(toProcedimentoDto(procedimento));
  };

  atualizar: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const procedimento = await this.procedimentoService.atualizar(
      String(request.params.id),
      request.body,
    );

    response.json(toProcedimentoDto(procedimento));
  };

  desativar: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const procedimento = await this.procedimentoService.desativar(String(request.params.id));

    response.json(toProcedimentoDto(procedimento));
  };
}
