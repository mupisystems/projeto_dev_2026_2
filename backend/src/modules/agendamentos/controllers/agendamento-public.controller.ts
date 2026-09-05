import type { Request, RequestHandler, Response } from 'express';

import { toAgendamentoDto } from '../../../shared/dtos/agendamento.dto.js';
import type { AgendamentoService } from '../services/agendamento.service.js';

// Controller publico de agendamentos.
// Responsavel por receber os dados do formulario e criar um agendamento pendente.
// Erros de dominio sao tratados pelo middleware global de erros.

export class AgendamentoPublicController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  criar: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const agendamento = await this.agendamentoService.criar(request.body);

    response.status(201).json(toAgendamentoDto(agendamento));
  };
}
