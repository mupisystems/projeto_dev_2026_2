import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { authService } from '../services/auth.service';

import { LoginPage } from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.me).mockRejectedValue(new Error('Não autenticado'));
  });

  const renderizarLoginPage = async () => {
    const view = render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>,
    );

    // Aguarda a resolução inicial da checagem de sessão do AuthProvider para evitar avisos de act
    await waitFor(() => {
      expect(authService.me).toHaveBeenCalled();
    });

    return view;
  };

  it('deve renderizar todos os campos de entrada, botão de acesso e link para o site público', async () => {
    await renderizarLoginPage();

    expect(screen.getByLabelText(/E-mail de Acesso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acessar Painel/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar para o site público/i })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('deve exibir mensagem de erro visual quando a autenticação falhar', async () => {
    const loginSpy = vi.spyOn(authService, 'login');
    loginSpy.mockRejectedValue(new Error('Credenciais inválidas.'));

    await renderizarLoginPage();

    fireEvent.change(screen.getByLabelText(/E-mail de Acesso/i), {
      target: { value: 'admin@clinica.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'senha-errada' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Acessar Painel/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas.')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve autenticar com sucesso e redirecionar para a rota administrativa /admin', async () => {
    const loginSpy = vi.spyOn(authService, 'login');
    loginSpy.mockResolvedValue({
      id: 'user-1',
      email: 'admin@sorrisomineiro.com.br',
      nome: 'Administrador',
      admin: true,
    });

    await renderizarLoginPage();

    fireEvent.change(screen.getByLabelText(/E-mail de Acesso/i), {
      target: { value: 'admin@sorrisomineiro.com.br' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'admin123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Acessar Painel/i }));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: 'admin@sorrisomineiro.com.br',
        senha: 'admin123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('deve desabilitar os campos e exibir indicador de carregamento durante a submissão', async () => {
    let resolverLogin: (value: {
      id: string;
      email: string;
      nome: string;
      admin: boolean;
    }) => void = () => {};
    const promessaLogin = new Promise<{ id: string; email: string; nome: string; admin: boolean }>(
      (resolve) => {
        resolverLogin = resolve;
      },
    );

    vi.spyOn(authService, 'login').mockReturnValue(promessaLogin);

    await renderizarLoginPage();

    const emailInput = screen.getByLabelText(/E-mail de Acesso/i);
    const senhaInput = screen.getByLabelText(/Senha/i);
    const botaoSubmit = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.change(emailInput, { target: { value: 'admin@sorrisomineiro.com.br' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.click(botaoSubmit);

    // Durante o processamento da Promise
    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(senhaInput).toBeDisabled();
      expect(botaoSubmit).toBeDisabled();
    });

    // Conclui o login
    resolverLogin({
      id: 'user-1',
      email: 'admin@sorrisomineiro.com.br',
      nome: 'Administrador',
      admin: true,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('deve limpar mensagem de erro anterior ao tentar submeter novamente', async () => {
    const loginSpy = vi.spyOn(authService, 'login');
    loginSpy.mockRejectedValueOnce(new Error('Primeiro erro'));

    await renderizarLoginPage();

    const botaoSubmit = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.click(botaoSubmit);

    await waitFor(() => {
      expect(screen.getByText('Primeiro erro')).toBeInTheDocument();
    });

    // Configura sucesso na segunda tentativa
    loginSpy.mockResolvedValueOnce({
      id: 'user-1',
      email: 'admin@sorrisomineiro.com.br',
      nome: 'Administrador',
      admin: true,
    });

    fireEvent.click(botaoSubmit);

    await waitFor(() => {
      expect(screen.queryByText('Primeiro erro')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
