import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryUsuarioRepository } from '../src/modules/usuarios/repositories/in-memory/usuario.repository.in-memory.js';
import { AuthService } from '../src/modules/usuarios/services/auth.service.js';
import { AppError } from '../src/shared/errors/app-error.js';

// Testes unitarios do service de autenticacao.
// Validam login, geracao de JWT e recuperacao de sessao com repositorio in-memory.

const authConfig = {
  secret: 'chave-secreta-de-teste-com-pelo-menos-32-caracteres',
  expiresIn: '1h' as const,
};

describe('AuthService', () => {
  let usuarioRepository: InMemoryUsuarioRepository;
  let service: AuthService;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    service = new AuthService(usuarioRepository, authConfig);
  });

  async function criarUsuario(
    email: string,
    senha: string,
    admin = false,
  ): Promise<{ id: string }> {
    const senhaHash = await import('bcryptjs').then((bc) => bc.hash(senha, 8));

    return usuarioRepository.criar({
      email,
      nome: 'Usuario Teste',
      senha: senhaHash,
      admin,
    });
  }

  it('deve autenticar com credenciais validas', async () => {
    const usuario = await criarUsuario('teste@email.com', 'senha123');

    const resultado = await service.login({ email: 'teste@email.com', senha: 'senha123' });

    expect(resultado.usuario.id).toBe(usuario.id);
    expect(resultado.token).toBeDefined();
  });

  it('deve recusar login com email inexistente', async () => {
    await expect(
      service.login({ email: 'naoexiste@email.com', senha: 'senha123' }),
    ).rejects.toThrow(new AppError('Credenciais invalidas', 401));
  });

  it('deve recusar login com senha incorreta', async () => {
    await criarUsuario('teste@email.com', 'senha123');

    await expect(
      service.login({ email: 'teste@email.com', senha: 'senha-errada' }),
    ).rejects.toThrow(new AppError('Credenciais invalidas', 401));
  });

  it('deve recusar login com dados invalidos', async () => {
    await expect(service.login({ email: '', senha: '' })).rejects.toThrow(
      new AppError('Email e senha sao obrigatorios', 400),
    );
  });

  it('deve recuperar o usuario a partir de um token valido', async () => {
    const usuario = await criarUsuario('teste@email.com', 'senha123');

    const { token } = await service.login({ email: 'teste@email.com', senha: 'senha123' });
    const usuarioRecuperado = await service.obterUsuarioPorToken(token);

    expect(usuarioRecuperado.id).toBe(usuario.id);
  });

  it('deve recusar token invalido', async () => {
    await expect(service.obterUsuarioPorToken('token-invalido')).rejects.toThrow(
      new AppError('Token invalido ou expirado', 401),
    );
  });

  it('deve recusar token de usuario removido do repositorio', async () => {
    await criarUsuario('teste@email.com', 'senha123');

    const { token } = await service.login({ email: 'teste@email.com', senha: 'senha123' });

    // Simula que o usuario foi removido apos a geracao do token.
    // Cria um novo repositorio vazio e mantem o mesmo segredo para validar o payload.
    const novoRepositorio = new InMemoryUsuarioRepository();
    const serviceComRepositorioVazio = new AuthService(novoRepositorio, authConfig);

    await expect(serviceComRepositorioVazio.obterUsuarioPorToken(token)).rejects.toThrow(
      new AppError('Usuario nao encontrado', 401),
    );
  });

  it('deve lancar erro se o segredo JWT nao estiver configurado', async () => {
    await criarUsuario('teste@email.com', 'senha123');

    const serviceSemSegredo = new AuthService(usuarioRepository, { secret: '', expiresIn: '1h' });

    await expect(
      serviceSemSegredo.login({ email: 'teste@email.com', senha: 'senha123' }),
    ).rejects.toThrow(new AppError('JWT_SECRET nao configurado', 500));
  });

  it('deve lancar erro se o segredo JWT tiver menos de 32 caracteres', async () => {
    await criarUsuario('teste@email.com', 'senha123');

    const serviceSegredoCurto = new AuthService(usuarioRepository, {
      secret: 'curto-menor-que-32-chars',
      expiresIn: '1h',
    });

    await expect(
      serviceSegredoCurto.login({ email: 'teste@email.com', senha: 'senha123' }),
    ).rejects.toThrow(new AppError('JWT_SECRET nao configurado', 500));
  });
});
