import { Router } from 'express';

import { publicCreationLimiter } from '../../../shared/middlewares/rate-limit.middleware.js';
import { validarSchema } from '../../../shared/middlewares/validate.middleware.js';
import { criarAgendamentoSchema } from '../../../shared/schemas/agendamento.schema.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { criarAgendamentoPublicController } from '../factories/agendamento-public.factory.js';

// Rotas publicas de agendamentos.
// Permite que visitantes criem agendamentos sem autenticacao.

const controller = criarAgendamentoPublicController();

export const agendamentoPublicRouter = Router();

agendamentoPublicRouter.post(
  '/',
  publicCreationLimiter,
  validarSchema(criarAgendamentoSchema),
  asyncHandler(controller.criar),
);
