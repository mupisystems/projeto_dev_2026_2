import type { Request, RequestHandler, Response } from 'express';

import type { HealthService } from '../services/health.service.js';
import type { MetricsService } from '../services/metrics.service.js';

// Controller publico do health check e metricas.
// Retorna 200 com status detalhado se o banco estiver acessivel e 503 caso contrario.
// Expoe metricas basicas de requisicoes em memoria.

export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly metricsService: MetricsService,
  ) {}

  check: RequestHandler = async (_request: Request, response: Response): Promise<void> => {
    const resultado = await this.healthService.verificar();
    const statusCode = resultado.database === 'connected' ? 200 : 503;

    response.status(statusCode).json(resultado);
  };

  metrics: RequestHandler = (_request: Request, response: Response): void => {
    response.json(this.metricsService.getMetrics());
  };
}
