import rateLimit from 'express-rate-limit';

// Limite para autenticacao: protege contra brute-force no login.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  },
});

// Limite para endpoints publicos que criam dados: evita spam.
export const publicCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    message: 'Limite de criacao atingido. Tente novamente mais tarde.',
  },
});

// Limite generico para rotas administrativas.
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    message: 'Muitas requisicoes. Tente novamente mais tarde.',
  },
});
