import { useState, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ThemeToggle } from '../components/ThemeToggle';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

// Página de login do painel administrativo.

export function LoginPage(): React.ReactNode {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (evento: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      await login(email, senha);
      await navigate('/admin');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao fazer login.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-card border border-default bg-surface p-8 sm:p-10 shadow-modal backdrop-blur-xl">
        <div className="mb-8 text-center space-y-3">
          <img
            src="/images/logo.png"
            alt="Sorriso Mineiro Logo"
            className="mx-auto h-[72px] w-[72px] object-contain"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">
              Painel Administrativo
            </h1>
            <p className="text-2xs text-muted mt-1">Sorriso Mineiro — Gestão de Atendimentos</p>
          </div>
        </div>

        {erro && (
          <Alert
            variant="error"
            className="mb-6"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            {erro}
          </Alert>
        )}

        <form
          onSubmit={(evento) => {
            void handleSubmit(evento);
          }}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-2xs font-bold text-secondary">
              E-mail de Acesso
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@sorrisomineiro.com.br"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
              }}
              disabled={carregando}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="senha" className="block text-2xs font-bold text-secondary">
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value);
              }}
              disabled={carregando}
              required
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full mt-2"
            isLoading={carregando}
          >
            Acessar Painel
          </Button>
        </form>

        <div className="mt-6 border-t border-default pt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-2xs font-semibold text-muted hover:text-link transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para o site público
          </Link>
        </div>
      </div>
    </div>
  );
}
