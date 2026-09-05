import { AuthController } from '../controllers/auth.controller.js';
import { AuthService, type AuthConfig } from '../services/auth.service.js';
import { PrismaUsuarioRepository } from '../usuario.repository.prisma.js';

// Factory centraliza a criação do controller de autenticação.
// Mantém a rota livre de lógica de composição de dependências.
// Carrega configuração JWT do ambiente, exigindo segredo seguro com no mínimo 32 caracteres.

function carregarAuthConfig(): AuthConfig {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres e ser configurado via ambiente.');
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '24h') as AuthConfig['expiresIn'];

  return { secret, expiresIn };
}

export function criarAuthController(): AuthController {
  const usuarioRepository = new PrismaUsuarioRepository();
  const authConfig = carregarAuthConfig();
  const authService = new AuthService(usuarioRepository, authConfig);

  return new AuthController(authService);
}
