import 'dotenv/config';

import { app } from './app.js';
import { logger } from './config/logger.js';

// Validação de inicialização para falhar imediatamente caso variáveis essenciais não estejam configuradas.

function validarAmbiente(): void {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  if (!databaseUrl || databaseUrl.trim() === '') {
    logger.error('A variável DATABASE_URL é obrigatória para iniciar o servidor.');
    process.exit(1);
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    logger.error('A variável JWT_SECRET é obrigatória e deve possuir no mínimo 32 caracteres.');
    process.exit(1);
  }
}

validarAmbiente();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const HOST = process.env.HOST ?? '0.0.0.0';

app.listen(PORT, HOST, () => {
  // Usa logger estruturado em vez de console.log para facilitar observabilidade.
  logger.info(`Servidor rodando em http://${HOST}:${String(PORT)}`);
});
