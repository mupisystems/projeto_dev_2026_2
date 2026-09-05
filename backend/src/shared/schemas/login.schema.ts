import { z } from 'zod';

// Schema usado tanto no endpoint publico de login quanto nas rotas protegidas.

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  senha: z.string().min(1).trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
