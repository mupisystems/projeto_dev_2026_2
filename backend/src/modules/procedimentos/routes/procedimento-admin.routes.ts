import { Router } from 'express';
import { z } from 'zod';

import { autenticar, exigirAdmin } from '../../../shared/middlewares/auth.middleware.js';
import { adminLimiter } from '../../../shared/middlewares/rate-limit.middleware.js';
import { validarParams, validarSchema } from '../../../shared/middlewares/validate.middleware.js';
import {
  criarProcedimentoSchema,
  atualizarProcedimentoSchema,
} from '../../../shared/schemas/procedimento.schema.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { criarProcedimentoAdminController } from '../factories/procedimento-admin.factory.js';

// Rotas administrativas de procedimentos.
// Requerem autenticacao e perfil de administrador.

const controller = criarProcedimentoAdminController();

export const procedimentoAdminRouter = Router();

const paramsIdSchema = z.object({ id: z.string().uuid() });

procedimentoAdminRouter.get(
  '/',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  asyncHandler(controller.listarTodos),
);
procedimentoAdminRouter.post(
  '/',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarSchema(criarProcedimentoSchema),
  asyncHandler(controller.criar),
);
procedimentoAdminRouter.patch(
  '/:id',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarParams(paramsIdSchema),
  validarSchema(atualizarProcedimentoSchema),
  asyncHandler(controller.atualizar),
);
procedimentoAdminRouter.delete(
  '/:id',
  adminLimiter,
  autenticar(),
  exigirAdmin,
  validarParams(paramsIdSchema),
  asyncHandler(controller.desativar),
);
