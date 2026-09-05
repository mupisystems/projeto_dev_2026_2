import type { Request, RequestHandler, Response } from 'express';

import { toAgendamentoDetalheDto, toAgendamentoDto } from '../../../shared/dtos/agendamento.dto.js';
import { listarAgendamentosSchema } from '../../../shared/schemas/agendamento.schema.js';
import type { AgendamentoService } from '../services/agendamento.service.js';

// Controller administrativo de agendamentos.
// Responsável por listar, detalhar e atualizar o status dos agendamentos no painel.
// Erros de domínio são tratados pelo middleware global de erros.

export class AgendamentoAdminController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  listar: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const query = listarAgendamentosSchema.parse(request.query);
    const resultado = await this.agendamentoService.listar(query);

    response.json({
      agendamentos: resultado.agendamentos.map(toAgendamentoDto),
      total: resultado.total,
    });
  };

  contarPorStatus: RequestHandler = async (
    _request: Request,
    response: Response,
  ): Promise<void> => {
    const contagem = await this.agendamentoService.contarPorStatus();

    response.json(contagem);
  };

  buscarPorId: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const agendamento = await this.agendamentoService.buscarPorId(String(request.params.id));

    response.json(toAgendamentoDetalheDto(agendamento));
  };

  atualizarStatus: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const agendamento = await this.agendamentoService.atualizarStatus(
      String(request.params.id),
      request.body,
    );

    response.json(toAgendamentoDto(agendamento));
  };
}
