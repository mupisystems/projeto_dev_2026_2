import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '../src/app.js';
import { metricsService } from '../src/modules/health/services/metrics.service.js';
import { prisma } from '../src/shared/database/prisma.js';

// Testes do health check e metricas.
// Verificam resposta detalhada quando o banco esta acessivel, quando falha e contagem de metricas.

describe('Health check e métricas', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    metricsService.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar status ok e detalhes quando o banco esta conectado', async () => {
    vi.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ '1': 1 }]);

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
    expect(typeof response.body.responseTimeMs).toBe('number');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('deve retornar erro e detalhes quando o banco esta desconectado', async () => {
    vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('Falha na conexao'));

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      status: 'error',
      database: 'disconnected',
    });
    expect(typeof response.body.responseTimeMs).toBe('number');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('deve expor metricas basicas de requisicoes em /api/health/metrics', async () => {
    await request(app).get('/api/health');
    await request(app).get('/api/health');

    const response = await request(app).get('/api/health/metrics');

    expect(response.status).toBe(200);
    expect(response.body.totalRequests).toBeGreaterThanOrEqual(2);
    expect(response.body.byMethod.GET).toBeGreaterThanOrEqual(2);
  });
});
