import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { App } from './App';

// Mock das chamadas de API pública e autenticação para isolar o teste do App de chamadas de rede.

vi.mock('./services/api', async () => {
  const actual = await vi.importActual<typeof import('./services/api')>('./services/api');
  return {
    ...actual,
    publicApi: {
      listarProcedimentos: vi.fn().mockResolvedValue([
        {
          id: 'proc-1',
          titulo: 'Limpeza e Profilaxia',
          ativa: true,
          preco: '150.00',
          duracaoMinutos: 45,
        },
      ]),
      criarAgendamento: vi.fn(),
    },
  };
});

vi.mock('./services/auth.service', () => ({
  authService: {
    me: vi.fn().mockRejectedValue(new Error('Não autenticado')),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('App', () => {
  it('deve renderizar a página inicial com a identidade da clínica', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const titulo = await screen.findByText(
      /O cuidado que o seu sorriso merece/i,
      {},
      { timeout: 5000 },
    );
    expect(titulo).toBeInTheDocument();

    const subtitulo = await screen.findByText(
      'Clínica Odontológica Especializada',
      {},
      { timeout: 5000 },
    );
    expect(subtitulo).toBeInTheDocument();

    expect(screen.getAllByText('Sorriso Mineiro').length).toBeGreaterThan(0);
  });

  it('deve renderizar a tela de login ao acessar a rota /admin/login', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <App />
      </MemoryRouter>,
    );

    const heading = await screen.findByRole(
      'heading',
      { name: /Painel Administrativo/i },
      { timeout: 5000 },
    );
    expect(heading).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail de Acesso/i)).toBeInTheDocument();
  });

  it('deve renderizar a tela de não encontrado ao acessar rota inexistente', async () => {
    render(
      <MemoryRouter initialEntries={['/rota-que-nao-existe']}>
        <App />
      </MemoryRouter>,
    );

    const heading404 = await screen.findByText(/404/i, {}, { timeout: 5000 });
    expect(heading404).toBeInTheDocument();
    expect(screen.getByText(/Página Não Encontrada/i)).toBeInTheDocument();
  });
});
