import type { Request, RequestHandler, Response } from 'express';

import type { AuthRequest } from '../../../shared/middlewares/auth.middleware.js';
import type { AuthService } from '../services/auth.service.js';

// Controller público de autenticação.
// Recebe email e senha, delega a validação para o AuthService e define o cookie httpOnly.
// Permite recuperar a sessão ativa e realizar logout com limpeza de cookies.

function obterOpcoesCookie(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'none' | 'lax' | 'strict';
} {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSiteEnv = process.env.COOKIE_SAME_SITE as 'none' | 'lax' | 'strict' | undefined;
  const sameSite = sameSiteEnv ?? (isProduction ? 'none' : 'lax');
  const secure =
    process.env.COOKIE_SECURE !== undefined ? process.env.COOKIE_SECURE === 'true' : isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite,
  };
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const { usuario, token } = await this.authService.login(request.body);
    const { httpOnly, secure, sameSite } = obterOpcoesCookie();

    response
      .cookie('token', token, {
        httpOnly,
        secure,
        sameSite,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        usuario: this.serializarUsuario(usuario),
        token,
      });
  };

  me: RequestHandler = async (request: Request, response: Response): Promise<void> => {
    const authRequest = request as AuthRequest;

    if (!authRequest.usuario) {
      response.status(401).json({ message: 'Token de autenticacao nao informado' });

      return;
    }

    const usuario = await this.authService.obterUsuarioPorId(authRequest.usuario.id);

    response.json({
      usuario: this.serializarUsuario(usuario),
    });
  };

  logout: RequestHandler = async (_request: Request, response: Response): Promise<void> => {
    const { httpOnly, secure, sameSite } = obterOpcoesCookie();

    response
      .clearCookie('token', {
        httpOnly,
        secure,
        sameSite,
      })
      .status(200)
      .json({ message: 'Logout realizado com sucesso' });
  };

  private serializarUsuario(usuario: { id: string; email: string; nome: string; admin: boolean }): {
    id: string;
    email: string;
    nome: string;
    admin: boolean;
  } {
    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      admin: usuario.admin,
    };
  }
}
