import { prisma } from '../../../shared/database/prisma.js';

// Service de verificacao de saude da aplicacao.
// Verifica se a conexao com o PostgreSQL esta funcionando e mede o tempo de resposta.

export interface HealthCheckResult {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  responseTimeMs: number;
  timestamp: string;
}

export class HealthService {
  async verificar(): Promise<HealthCheckResult> {
    const inicio = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const responseTimeMs = Date.now() - inicio;

      return {
        status: 'ok',
        database: 'connected',
        responseTimeMs,
        timestamp: new Date().toISOString(),
      };
    } catch {
      const responseTimeMs = Date.now() - inicio;

      return {
        status: 'error',
        database: 'disconnected',
        responseTimeMs,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
