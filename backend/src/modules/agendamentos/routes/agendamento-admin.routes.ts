import { Router } from 'express';
import { z } from 'zod';

import { autenticar, exigirAdmin } from '../../../shared/middlewares/auth.middleware.js';
import { adminLimiter } from '../../../shared/middlewares/rate-limit.middleware.js';
import {
  validarParams,
  validarSchema,
  validarQuery,
} from '../../../shared/middlewares/validate.middleware.js';
import {
  atualizarStatusAgendamentoSchema,
  listarAgendamentosSchema,
} from '../../../shared/schemas/agendamento.schema.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { criarAgendamentoAdminController } from '../factories/agendamento-admin.factory.js';

// Rotas administrativas de agendamentos.
// Requerem autenticacao e perfil de administrador.

const controller = criarAgendamentoAdminController();

export const agendamentoAdminRouter = Router();

const paramsIdSchema = z.object({ id: z.string().uuid() });

agendamentoAdminRouter.get(
  '/',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarQuery(listarAgendamentosSchema),
  asyncHandler(controller.listar),
);
agendamentoAdminRouter.get(
  '/contagem',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  asyncHandler(controller.contarPorStatus),
);
agendamentoAdminRouter.get(
  '/:id',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarParams(paramsIdSchema),
  asyncHandler(controller.buscarPorId),
);
agendamentoAdminRouter.patch(
  '/:id/status',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarParams(paramsIdSchema),
  validarSchema(atualizarStatusAgendamentoSchema),
  asyncHandler(controller.atualizarStatus),
);
