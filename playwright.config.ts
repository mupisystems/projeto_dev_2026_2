import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração da suíte de testes de ponta a ponta (E2E) com Playwright.
 * Valida a jornada real do paciente e do administrador em navegador Chromium.
 */
export default defineConfig({
  globalSetup: './e2e/global-setup.ts',
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -w backend',
      url: 'http://localhost:3000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: {
        ...(process.env as Record<string, string>),
        NODE_ENV: 'test',
        DATABASE_URL:
          process.env.DATABASE_URL ||
          'postgresql://odontoagenda:odontoagenda@localhost:5432/odontoagenda?schema=public',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
        JWT_SECRET: process.env.JWT_SECRET || 'chave-secreta-de-teste-ci-minimo-32-caracteres',
      },
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev -w frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: {
        ...(process.env as Record<string, string>),
        VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
      },
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
