import type { Usuario } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppError } from '../../../shared/errors/app-error.js';
import { loginSchema, type LoginInput } from '../../../shared/schemas/login.schema.js';
import type { UsuarioRepository } from '../usuario.repository.js';

// Service de autenticacao responsavel por validar credenciais e gerar tokens JWT.
// Mantem a logica de login fora dos controllers e independente do framework web.
// A configuracao JWT e injetada via factory para facilitar testes e respeitar DI.

export interface AuthPayload {
  id: string;
  email: string;
  admin: boolean;
}

export interface AuthConfig {
  secret: string;
  expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}`;
}

export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly authConfig: AuthConfig,
  ) {}

  async login(input: LoginInput): Promise<{ usuario: Usuario; token: string }> {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError('Email e senha sao obrigatorios', 400);
    }

    const { email, senha } = parsed.data;
    const usuario = await this.usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      throw new AppError('Credenciais invalidas', 401);
    }

    const senhaValida = await bcryptjs.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new AppError('Credenciais invalidas', 401);
    }

    const token = this.gerarToken({
      id: usuario.id,
      email: usuario.email,
      admin: usuario.admin,
    });

    return { usuario, token };
  }

  async obterUsuarioPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new AppError('Usuario nao encontrado', 401);
    }

    return usuario;
  }

  async obterUsuarioPorToken(token: string): Promise<Usuario> {
    if (!this.authConfig.secret || this.authConfig.secret.length < 32) {
      throw new AppError('JWT_SECRET nao configurado', 500);
    }

    let payload: AuthPayload;

    try {
      payload = jwt.verify(token, this.authConfig.secret) as AuthPayload;
    } catch {
      throw new AppError('Token invalido ou expirado', 401);
    }

    return this.obterUsuarioPorId(payload.id);
  }

  private gerarToken(payload: AuthPayload): string {
    if (!this.authConfig.secret || this.authConfig.secret.length < 32) {
      throw new AppError('JWT_SECRET nao configurado', 500);
    }

    return jwt.sign(payload, this.authConfig.secret, {
      expiresIn: this.authConfig.expiresIn,
    });
  }
}
