import type { NextFunction, Request, Response } from 'express';

import { logger } from '../../config/logger.js';
import { AppError } from '../errors/app-error.js';

// Middleware central de tratamento de erros.
// Converte AppError no statusCode definido e erros inesperados em 500.
// Registra falhas internas com o logger estruturado Pino para observabilidade.

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });

    return;
  }

  logger.error({ err: error }, 'Erro interno capturado no middleware global de erros');

  response.status(500).json({ message: 'Erro interno no servidor' });
}
