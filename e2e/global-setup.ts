import { execSync } from 'node:child_process';

/**
 * Setup global executado antes de todos os testes E2E do Playwright.
 * Garante que o banco de dados esteja devidamente populado com o seed de dados
 * mesmo após a execução de testes de integração ou suites prévias.
 */
export default async function globalSetup(): Promise<void> {
  execSync('npm run db:seed -w backend', {
    stdio: 'inherit',
    env: {
      ...process.env,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    },
  });
}
