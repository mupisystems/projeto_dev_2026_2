import { z } from 'zod';

// Schemas de validacao refletem as constraints do schema Prisma.
// Todos os campos seguem o dominio em portugues para manter consistencia.

export const criarProcedimentoSchema = z.object({
  titulo: z.string().min(1).max(255),
  ativa: z.boolean().default(true),
  preco: z.number().nonnegative().nullable().optional(),
  duracaoMinutos: z.number().int().positive().nullable().optional(),
});

export const atualizarProcedimentoSchema = z.object({
  titulo: z.string().min(1).max(255).optional(),
  ativa: z.boolean().optional(),
  preco: z.number().nonnegative().nullable().optional(),
  duracaoMinutos: z.number().int().positive().nullable().optional(),
});

export type CriarProcedimentoInput = z.infer<typeof criarProcedimentoSchema>;
export type AtualizarProcedimentoInput = z.infer<typeof atualizarProcedimentoSchema>;
