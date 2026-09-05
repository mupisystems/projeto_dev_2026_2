import { PrismaClient } from '@prisma/client';

// Instancia unica do Prisma Client para toda a aplicacao.
// Em testes, a mesma instancia e reaproveitada para evitar conexoes desnecessarias.

const prisma = new PrismaClient();

export { prisma };
