import { z } from 'zod';

// Regex simples para validar formato de horario HH:MM.
const horarioRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const criarAgendamentoSchema = z.object({
  nome: z.string().min(1).max(255),
  email: z.string().email().max(255),
  telefone: z.string().max(50).nullable().optional(),
  data: z.coerce.date(),
  horario: z.string().regex(horarioRegex, 'Horario deve estar no formato HH:MM'),
  observacao: z.string().max(1000).nullable().optional(),
  procedimentoId: z.string().uuid(),
});

export const atualizarStatusAgendamentoSchema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO']),
});

export const listarAgendamentosSchema = z.object({
  status: z
    .enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO'])
    .optional()
    .or(z.literal('').transform(() => undefined)),
  busca: z.string().optional(),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().positive().max(100).default(10),
});

export type CriarAgendamentoInput = z.infer<typeof criarAgendamentoSchema>;
export type AtualizarStatusAgendamentoInput = z.infer<typeof atualizarStatusAgendamentoSchema>;
export type ListarAgendamentosInput = z.infer<typeof listarAgendamentosSchema>;
