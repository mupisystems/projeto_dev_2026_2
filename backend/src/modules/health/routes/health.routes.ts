import { Router } from 'express';

import { HealthController } from '../controllers/health.controller.js';
import { HealthService } from '../services/health.service.js';
import { metricsService } from '../services/metrics.service.js';

// Rota publica de health check e metricas.
// Nao depende de autenticacao para permitir monitoramento externo.

const healthService = new HealthService();
const healthController = new HealthController(healthService, metricsService);

const healthRouter = Router();

healthRouter.get('/', healthController.check);
healthRouter.get('/metrics', healthController.metrics);

export { healthRouter };
