import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      JWT_SECRET: 'chave-secreta-de-teste-com-pelo-menos-32-caracteres',
    },
    include: ['tests/**/*.spec.ts'],
    exclude: ['tests/**/*.integration.spec.ts', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.d.ts', 'src/**/*.config.*'],
    },
  },
});
