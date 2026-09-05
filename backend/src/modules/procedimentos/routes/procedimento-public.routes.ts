import { Router } from 'express';

import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { criarProcedimentoPublicController } from '../factories/procedimento-public.factory.js';

// Rotas publicas de procedimentos.
// Apenas a listagem de procedimentos ativos e disponivel sem autenticacao.

const controller = criarProcedimentoPublicController();

export const procedimentoPublicRouter = Router();

procedimentoPublicRouter.get('/', asyncHandler(controller.listarAtivos));
