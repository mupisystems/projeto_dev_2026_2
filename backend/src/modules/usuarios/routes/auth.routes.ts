import { Router } from 'express';

import { autenticar } from '../../../shared/middlewares/auth.middleware.js';
import { authLimiter } from '../../../shared/middlewares/rate-limit.middleware.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { criarAuthController } from '../factories/auth.factory.js';

// Rotas publicas de autenticacao.
// O controller gerencia o login de administradores e a recuperacao de sessao.

const authController = criarAuthController();

export const authRouter = Router();

authRouter.post('/login', authLimiter, asyncHandler(authController.login));
authRouter.get('/me', autenticar(), asyncHandler(authController.me));
authRouter.post('/logout', asyncHandler(authController.logout));
