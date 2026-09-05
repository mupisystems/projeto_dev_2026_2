import type { Usuario } from '@prisma/client';

import type { UsuarioData, UsuarioRepository } from '../../usuario.repository.js';

// Repositorio in-memory para testes unitarios de autenticacao.
// Simula o banco de usuarios em memoria RAM sem tocar no PostgreSQL.

export class InMemoryUsuarioRepository implements UsuarioRepository {
  private usuarios: Usuario[] = [];

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.email === email) ?? null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.id === id) ?? null;
  }

  async criar(dados: UsuarioData): Promise<Usuario> {
    const usuario = {
      ...dados,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    } as Usuario;

    this.usuarios.push(usuario);

    return usuario;
  }
}
