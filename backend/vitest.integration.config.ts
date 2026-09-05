import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      JWT_SECRET: 'chave-secreta-de-teste-com-pelo-menos-32-caracteres',
      ADMIN_PASSWORD: 'senha-admin-teste-123',
    },
    include: ['tests/**/*.integration.spec.ts'],
    setupFiles: ['tests/integration/setup.ts'],
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.d.ts'],
    },
  },
});
