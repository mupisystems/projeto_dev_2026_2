import type { OpenApiBuilder, SchemaObject } from 'openapi3-ts/oas31';
import { OpenApiBuilder as Builder } from 'openapi3-ts/oas31';

// Documentacao OpenAPI da API OdontoAgenda.
// Define os endpoints publicos e administrativos disponiveis.

const builder = new Builder()
  .addTitle('Sorriso Mineiro API')
  .addDescription(
    'API REST para agendamento de consultas odontológicas na clínica Sorriso Mineiro.',
  )
  .addVersion('1.0.0')
  .addServer({ url: 'http://localhost:3000/api', description: 'Desenvolvimento local' });

const procedimentoSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    titulo: { type: 'string' },
    ativa: { type: 'boolean' },
    preco: { type: 'string' },
    duracaoMinutos: { type: 'integer' },
    criadoEm: { type: 'string', format: 'date-time' },
    atualizadoEm: { type: 'string', format: 'date-time' },
  },
};

const agendamentoSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nome: { type: 'string' },
    email: { type: 'string', format: 'email' },
    telefone: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    data: { type: 'string', format: 'date-time' },
    horario: { type: 'string' },
    observacao: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    status: { type: 'string', enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO'] },
    procedimentoId: { type: 'string', format: 'uuid' },
    criadoEm: { type: 'string', format: 'date-time' },
    atualizadoEm: { type: 'string', format: 'date-time' },
  },
};

const historicoSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    agendamentoId: { type: 'string', format: 'uuid' },
    statusAnterior: { type: 'string' },
    statusNovo: { type: 'string' },
    alteradoEm: { type: 'string', format: 'date-time' },
  },
};

const errorSchema: SchemaObject = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
};

builder.addSchema('Procedimento', procedimentoSchema);
builder.addSchema('Agendamento', agendamentoSchema);
builder.addSchema('HistoricoStatus', historicoSchema);
builder.addSchema('Erro', errorSchema);

const tagHealth = { name: 'Health', description: 'Verificacao de saude da API' };
const tagPublico = { name: 'Publico', description: 'Endpoints publicos da aplicacao' };
const tagAuth = { name: 'Autenticacao', description: 'Login e sessao do administrador' };
const tagAdmin = { name: 'Admin', description: 'Endpoints protegidos do painel administrativo' };

builder.addTag(tagHealth);
builder.addTag(tagPublico);
builder.addTag(tagAuth);
builder.addTag(tagAdmin);

builder.addPath('/health', {
  get: {
    tags: ['Health'],
    summary: 'Verifica saude da API e do banco',
    responses: {
      '200': {
        description: 'API e banco estao funcionando',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ok' },
                database: { type: 'string', example: 'connected' },
              },
            },
          },
        },
      },
      '503': {
        description: 'Banco indisponivel',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro' },
          },
        },
      },
    },
  },
});

builder.addPath('/procedimentos', {
  get: {
    tags: ['Publico'],
    summary: 'Lista procedimentos ativos',
    responses: {
      '200': {
        description: 'Lista de procedimentos ativos',
        content: {
          'application/json': {
            schema: { type: 'array', items: { $ref: '#/components/schemas/Procedimento' } },
          },
        },
      },
    },
  },
});

builder.addPath('/agendamentos', {
  post: {
    tags: ['Publico'],
    summary: 'Cria um agendamento',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              email: { type: 'string', format: 'email' },
              telefone: { anyOf: [{ type: 'string' }, { type: 'null' }] },
              data: { type: 'string', format: 'date' },
              horario: { type: 'string' },
              observacao: { anyOf: [{ type: 'string' }, { type: 'null' }] },
              procedimentoId: { type: 'string', format: 'uuid' },
            },
            required: ['nome', 'email', 'data', 'horario', 'procedimentoId'],
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Agendamento criado com sucesso',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Agendamento' },
          },
        },
      },
      '400': { description: 'Dados invalidos' },
      '409': { description: 'Conflito de agendamento' },
    },
  },
});

builder.addPath('/auth/login', {
  post: {
    tags: ['Autenticacao'],
    summary: 'Autentica o administrador',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              senha: { type: 'string', format: 'password' },
            },
            required: ['email', 'senha'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Login bem-sucedido',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    nome: { type: 'string' },
                    admin: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
      '401': { description: 'Credenciais invalidas' },
    },
  },
});

builder.addPath('/auth/me', {
  get: {
    tags: ['Autenticacao'],
    summary: 'Recupera dados do usuario autenticado',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Dados do usuario logado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    nome: { type: 'string' },
                    admin: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
      '401': { description: 'Token invalido ou ausente' },
    },
  },
});

builder.addPath('/auth/logout', {
  post: {
    tags: ['Autenticacao'],
    summary: 'Encerra a sessao do usuario limpando o cookie de autenticacao',
    responses: {
      '200': {
        description: 'Logout realizado com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Logout realizado com sucesso' },
              },
            },
          },
        },
      },
    },
  },
});

builder.addPath('/admin/agendamentos', {
  get: {
    tags: ['Admin'],
    summary: 'Lista agendamentos com filtros e paginacao',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'status',
        in: 'query',
        schema: { type: 'string', enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO'] },
      },
      { name: 'busca', in: 'query', schema: { type: 'string' } },
      { name: 'pagina', in: 'query', schema: { type: 'integer', default: 1 } },
      { name: 'limite', in: 'query', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      '200': {
        description: 'Lista paginada de agendamentos',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                agendamentos: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Agendamento' },
                },
                total: { type: 'integer' },
              },
            },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
    },
  },
});

builder.addPath('/admin/agendamentos/{id}', {
  get: {
    tags: ['Admin'],
    summary: 'Detalha agendamento com historico de status',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
    ],
    responses: {
      '200': {
        description: 'Detalhes do agendamento',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                agendamento: { $ref: '#/components/schemas/Agendamento' },
                historico: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/HistoricoStatus' },
                },
              },
            },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
      '404': { description: 'Agendamento nao encontrado' },
    },
  },
});

builder.addPath('/admin/agendamentos/{id}/status', {
  patch: {
    tags: ['Admin'],
    summary: 'Atualiza status de um agendamento',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO'] },
            },
            required: ['status'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Status atualizado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Agendamento' },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
      '404': { description: 'Agendamento nao encontrado' },
      '409': { description: 'Transicao de status invalida' },
    },
  },
});

builder.addPath('/admin/procedimentos', {
  get: {
    tags: ['Admin'],
    summary: 'Lista todos os procedimentos',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Lista completa de procedimentos',
        content: {
          'application/json': {
            schema: { type: 'array', items: { $ref: '#/components/schemas/Procedimento' } },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
    },
  },
  post: {
    tags: ['Admin'],
    summary: 'Cria um novo procedimento',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              titulo: { type: 'string' },
              ativa: { type: 'boolean' },
              preco: { anyOf: [{ type: 'number' }, { type: 'null' }] },
              duracaoMinutos: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
            },
            required: ['titulo', 'ativa'],
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Procedimento criado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Procedimento' },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
      '400': { description: 'Dados invalidos' },
    },
  },
});

builder.addPath('/admin/procedimentos/{id}', {
  patch: {
    tags: ['Admin'],
    summary: 'Atualiza um procedimento',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              titulo: { type: 'string' },
              ativa: { type: 'boolean' },
              preco: { anyOf: [{ type: 'number' }, { type: 'null' }] },
              duracaoMinutos: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Procedimento atualizado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Procedimento' },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
      '404': { description: 'Procedimento nao encontrado' },
    },
  },
  delete: {
    tags: ['Admin'],
    summary: 'Desativa/exclui um procedimento com seguranca',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
    ],
    responses: {
      '200': {
        description: 'Procedimento desativado/excluido',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Procedimento' },
          },
        },
      },
      '401': { description: 'Nao autenticado' },
      '404': { description: 'Procedimento nao encontrado' },
    },
  },
});

builder.addSecurityScheme('bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Token JWT obtido no login',
});

export const swaggerDocument = builder.getSpec();
export type { OpenApiBuilder };
