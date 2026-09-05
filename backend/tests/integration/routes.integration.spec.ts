import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

import { app } from '../../src/app.js';
import { prisma } from '../../src/shared/database/prisma.js';

// Testes de integracao das rotas HTTP publicas e administrativas.
// Usam supertest para bater nos endpoints sem subir o servidor.

const ADMIN_EMAIL = 'admin@sorrisomineiro.com.br';
const ADMIN_SENHA = process.env.ADMIN_PASSWORD ?? 'senha-admin-teste-123';

let token: string;
let procedimentoId: string;

describe('Rotas HTTP', () => {
  beforeAll(async () => {
    // Limpa agendamentos para garantir consistencia entre execucoes.
    await prisma.agendamento.deleteMany();

    // Garante que o admin do seed existe com a senha correta.
    const usuario = await prisma.usuario.findUnique({ where: { email: ADMIN_EMAIL } });

    if (!usuario) {
      throw new Error('Usuario admin nao encontrado. Execute o seed primeiro.');
    }

    const login = await request(app).post('/api/auth/login').send({
      email: ADMIN_EMAIL,
      senha: ADMIN_SENHA,
    });

    token = login.body.token;
  });

  beforeEach(async () => {
    await prisma.agendamento.deleteMany();

    // Cria um procedimento ativo para os testes.
    const procedimento = await prisma.procedimento.create({
      data: {
        titulo: 'Procedimento Teste',
        ativa: true,
        preco: 100,
        duracaoMinutos: 30,
      },
    });

    procedimentoId = procedimento.id;
  });

  describe('GET /api/procedimentos', () => {
    it('deve listar procedimentos ativos publicamente', async () => {
      const response = await request(app).get('/api/procedimentos');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/agendamentos', () => {
    it('deve criar um agendamento com dados validos', async () => {
      const response = await request(app).post('/api/agendamentos').send({
        nome: 'Maria Silva',
        email: 'maria@email.com',
        data: '2026-10-10',
        horario: '14:00',
        procedimentoId,
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDENTE');
    });

    it('deve recusar agendamento com dados invalidos', async () => {
      const response = await request(app).post('/api/agendamentos').send({
        nome: '',
        email: 'email-invalido',
        data: 'invalido',
        horario: '99:99',
        procedimentoId,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve autenticar com credenciais validas', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: ADMIN_EMAIL,
        senha: ADMIN_SENHA,
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('deve recusar credenciais invalidas', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: ADMIN_EMAIL,
        senha: 'senha-errada',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Rotas administrativas protegidas', () => {
    it('deve bloquear rota admin sem token', async () => {
      const response = await request(app).get('/api/admin/agendamentos');

      expect(response.status).toBe(401);
    });

    it('deve listar agendamentos com token valido', async () => {
      const response = await request(app)
        .get('/api/admin/agendamentos')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.agendamentos).toBeInstanceOf(Array);
    });

    it('deve retornar contagem agregada de agendamentos por status', async () => {
      await request(app).post('/api/agendamentos').send({
        nome: 'Pendente 1',
        email: 'p1@email.com',
        data: '2026-10-10',
        horario: '10:00',
        procedimentoId,
      });

      const response = await request(app)
        .get('/api/admin/agendamentos/contagem')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          total: 1,
          pendentes: 1,
          confirmados: 0,
          cancelados: 0,
          atendidos: 0,
        }),
      );
    });
  });

  describe('PATCH /api/admin/agendamentos/:id/status', () => {
    it('deve confirmar e depois cancelar um agendamento', async () => {
      const criado = await request(app).post('/api/agendamentos').send({
        nome: 'Maria Silva',
        email: 'maria@email.com',
        data: '2026-10-10',
        horario: '14:00',
        procedimentoId,
      });

      const agendamentoId = String(criado.body.id);

      const confirmado = await request(app)
        .patch(`/api/admin/agendamentos/${agendamentoId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'CONFIRMADO' });

      expect(confirmado.status).toBe(200);
      expect(confirmado.body.status).toBe('CONFIRMADO');

      const cancelado = await request(app)
        .patch(`/api/admin/agendamentos/${agendamentoId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'CANCELADO' });

      expect(cancelado.status).toBe(200);
      expect(cancelado.body.status).toBe('CANCELADO');
    });
  });

  describe('CRUD de procedimentos admin', () => {
    it('deve criar e atualizar um procedimento', async () => {
      const criado = await request(app)
        .post('/api/admin/procedimentos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Novo Procedimento',
          ativa: true,
          preco: 200,
          duracaoMinutos: 60,
        });

      expect(criado.status).toBe(201);
      expect(criado.body.titulo).toBe('Novo Procedimento');

      const novoProcedimentoId = String(criado.body.id);

      const atualizado = await request(app)
        .patch(`/api/admin/procedimentos/${novoProcedimentoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ titulo: 'Procedimento Atualizado' });

      expect(atualizado.status).toBe(200);
      expect(atualizado.body.titulo).toBe('Procedimento Atualizado');
    });
  });

  describe('Autenticação e Sessão com Cookies httpOnly', () => {
    it('deve realizar login definindo cookie httpOnly e recuperar sessao via cookie', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: ADMIN_EMAIL,
        senha: ADMIN_SENHA,
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.usuario.email).toBe(ADMIN_EMAIL);
      expect(loginRes.headers['set-cookie']).toBeDefined();

      const cookies = loginRes.headers['set-cookie'] as unknown as string[];
      const cookieToken = cookies.find((c) => c.startsWith('token='));
      expect(cookieToken).toBeDefined();
      expect(cookieToken).toContain('HttpOnly');

      // Testa recuperacao de usuario logado enviando o cookie
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [cookieToken ?? '']);
      expect(meRes.status).toBe(200);
      expect(meRes.body.usuario.email).toBe(ADMIN_EMAIL);

      // Testa logout limpando cookie
      const logoutRes = await request(app).post('/api/auth/logout');
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.headers['set-cookie']).toBeDefined();
    });
  });
});
