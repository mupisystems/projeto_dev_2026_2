import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { swaggerDocument } from './config/swagger.js';
import { agendamentoAdminRouter } from './modules/agendamentos/routes/agendamento-admin.routes.js';
import { agendamentoPublicRouter } from './modules/agendamentos/routes/agendamento-public.routes.js';
import { healthRouter } from './modules/health/routes/health.routes.js';
import { metricsService } from './modules/health/services/metrics.service.js';
import { procedimentoAdminRouter } from './modules/procedimentos/routes/procedimento-admin.routes.js';
import { procedimentoPublicRouter } from './modules/procedimentos/routes/procedimento-public.routes.js';
import { authRouter } from './modules/usuarios/routes/auth.routes.js';
import { errorHandler } from './shared/middlewares/error.middleware.js';

// Aplicação Express configurada com middlewares globais e rotas.
// Este é o composition root do backend.

export const app: Application = express();

// Contabiliza metricas basicas de requisicoes em memoria.
app.use((req, _res, next) => {
  metricsService.increment(req.method);
  next();
});

// Helmet adiciona headers de segurança básicos.
app.use(helmet());

// CORS limitado às origens configuradas via ambiente com suporte a credenciais.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Documentacao interativa da API em /api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check verifica tambem a conectividade com o PostgreSQL.
app.use('/api/health', healthRouter);

// Rotas publicas.
app.use('/api/procedimentos', procedimentoPublicRouter);
app.use('/api/agendamentos', agendamentoPublicRouter);
app.use('/api/auth', authRouter);

// Rotas administrativas.
app.use('/api/admin/procedimentos', procedimentoAdminRouter);
app.use('/api/admin/agendamentos', agendamentoAdminRouter);

// Middleware central de tratamento de erros.
app.use(errorHandler);
