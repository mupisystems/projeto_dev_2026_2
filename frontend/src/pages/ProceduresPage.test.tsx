import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { adminApi } from '../services/admin.service';
import { authService } from '../services/auth.service';

import { ProceduresPage } from './ProceduresPage';

vi.mock('../services/admin.service', () => ({
  adminApi: {
    listarProcedimentos: vi.fn(),
    criarProcedimento: vi.fn(),
    atualizarProcedimento: vi.fn(),
    excluirProcedimento: vi.fn(),
  },
}));

vi.mock('../services/auth.service', () => ({
  authService: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockProcedimentos = [
  {
    id: 'p-1',
    titulo: 'Limpeza Dental',
    ativa: true,
    preco: '150.00',
    duracaoMinutos: 30,
  },
  {
    id: 'p-2',
    titulo: 'Canal',
    ativa: false,
    preco: '600.00',
    duracaoMinutos: 90,
  },
];

describe('ProceduresPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.me).mockResolvedValue({
      id: 'admin-1',
      nome: 'Dra. Beatriz Santos',
      email: 'admin@sorrisomineiro.com.br',
      admin: true,
    });
    vi.mocked(adminApi.listarProcedimentos).mockResolvedValue(mockProcedimentos);
  });

  it('deve listar os procedimentos cadastrados na tabela', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ProceduresPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Limpeza Dental')).toBeInTheDocument();
      expect(screen.getByText('Canal')).toBeInTheDocument();
      expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    });
  });

  it('deve exibir erros de validação ao tentar cadastrar com título vazio ou inválido', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ProceduresPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Limpeza Dental')).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /Cadastrar Procedimento/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('O título do procedimento deve ter pelo menos 3 caracteres.'),
      ).toBeInTheDocument();
    });
  });

  it('deve chamar adminApi.criarProcedimento quando o formulário for preenchido corretamente', async () => {
    const criarSpy = vi.spyOn(adminApi, 'criarProcedimento');
    criarSpy.mockResolvedValue({
      id: 'p-3',
      titulo: 'Ortodontia Invisalign',
      ativa: true,
      preco: '3500.00',
      duracaoMinutos: 45,
    });

    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ProceduresPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Título do Procedimento/i), {
      target: { value: 'Ortodontia Invisalign' },
    });
    fireEvent.change(screen.getByLabelText(/Preço Estimado/i), {
      target: { value: '3500' },
    });
    fireEvent.change(screen.getByLabelText(/Duração Estimada/i), {
      target: { value: '45' },
    });

    const submitBtn = screen.getByRole('button', { name: /Cadastrar Procedimento/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(criarSpy).toHaveBeenCalledWith({
        titulo: 'Ortodontia Invisalign',
        ativa: true,
        preco: 3500,
        duracaoMinutos: 45,
      });
    });
  });
});
