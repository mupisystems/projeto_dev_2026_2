import type { Usuario } from '@prisma/client';

import { prisma } from '../../shared/database/prisma.js';

import type { UsuarioData, UsuarioRepository } from './usuario.repository.js';

// Implementacao do repositorio de usuarios com Prisma.
// Responsavel apenas por buscar e criar usuarios no banco.

export class PrismaUsuarioRepository implements UsuarioRepository {
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
    });
  }

  async criar(dados: UsuarioData): Promise<Usuario> {
    return prisma.usuario.create({ data: dados });
  }
}
