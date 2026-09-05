// Service de metricas basicas em memoria.
// Registra total de requisicoes e contagem por metodo HTTP.

export interface MetricsData {
  totalRequests: number;
  byMethod: Record<string, number>;
}

export class MetricsService {
  private total = 0;
  private byMethod: Record<string, number> = {};

  increment(method: string): void {
    this.total += 1;
    this.byMethod[method] = (this.byMethod[method] ?? 0) + 1;
  }

  getMetrics(): MetricsData {
    return {
      totalRequests: this.total,
      byMethod: { ...this.byMethod },
    };
  }

  reset(): void {
    this.total = 0;
    this.byMethod = {};
  }
}

export const metricsService = new MetricsService();
