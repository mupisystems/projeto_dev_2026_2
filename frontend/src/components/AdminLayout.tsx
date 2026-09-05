import { useState, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../hooks/useTheme.js';
import { cn } from '../lib/cn.js';

import { ScrollToTopButton } from './ScrollToTopButton.js';
import { Button } from './ui/Button.js';
import { IconButton } from './ui/IconButton.js';

interface AdminLayoutProps {
  children: ReactNode;
  titulo?: string;
  subtitulo?: string;
  acoes?: ReactNode;
}

export function AdminLayout({
  children,
  titulo,
  subtitulo,
  acoes,
}: AdminLayoutProps): React.ReactNode {
  const [menuAberto, setMenuAberto] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const handleLogout = async (): Promise<void> => {
    await logout();
    await navigate('/admin/login');
  };

  const navItems = [
    {
      to: '/admin',
      label: 'Dashboard',
      sublabel: 'Visão Geral & Métricas',
      ativo: location.pathname === '/admin',
      icone: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      to: '/admin/agenda',
      label: 'Agenda Clínica',
      sublabel: 'Grade Diária & Horários',
      ativo: location.pathname === '/admin/agenda',
      icone: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      to: '/admin/pacientes',
      label: 'Pacientes',
      sublabel: 'Carteira & Histórico',
      ativo: location.pathname === '/admin/pacientes',
      icone: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      to: '/admin/procedimentos',
      label: 'Procedimentos',
      sublabel: 'Catálogo de Serviços',
      ativo: location.pathname === '/admin/procedimentos',
      icone: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-primary antialiased">
      {/* Overlay Mobile */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setMenuAberto(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMenuAberto(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Fechar menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col justify-between border-r border-default bg-surface shadow-xl transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 overflow-y-auto',
          menuAberto ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div>
          <div className="flex items-center justify-between border-b border-default px-6 py-5">
            <Link to="/admin" className="group flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Sorriso Mineiro Logo"
                className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105"
              />
              <div className="min-w-0">
                <span className="block text-base font-black leading-tight tracking-tight text-primary">
                  Sorriso Mineiro
                </span>
                <span className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Painel Clínico
                </span>
              </div>
            </Link>

            <IconButton
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => {
                setMenuAberto(false);
              }}
              aria-label="Fechar navegação"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>

          <nav className="space-y-1.5 p-4">
            <div className="px-3 pb-2 text-3xs font-bold uppercase tracking-wider text-muted">
              Menu de Gestão
            </div>

            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setMenuAberto(false);
                }}
                className={cn(
                  'group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-sm font-bold transition-all',
                  item.ativo
                    ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25'
                    : 'text-secondary hover:bg-surface-hover hover:text-primary',
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                    item.ativo
                      ? 'bg-white/20 text-white'
                      : 'bg-inset text-muted group-hover:bg-surface-hover group-hover:text-primary',
                  )}
                >
                  {item.icone}
                </div>
                <div className="min-w-0">
                  <div className="leading-tight">{item.label}</div>
                  <div
                    className={cn(
                      'text-2xs font-normal truncate',
                      item.ativo ? 'text-white/80' : 'text-muted',
                    )}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </Link>
            ))}

            <div className="px-3 pb-2 pt-4 text-3xs font-bold uppercase tracking-wider text-muted">
              Atalhos Rápidos
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-hover hover:text-accent"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-inset text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
                <span>Ver Página Pública</span>
              </div>
              <svg
                className="h-3.5 w-3.5 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="border-t border-default p-4">
          <div className="mb-3 rounded-2xl border border-default bg-inset p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-white shadow-sm">
                {usuario?.nome ? usuario.nome.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-2xs font-bold text-primary truncate">
                  {usuario?.nome ?? 'Administrador'}
                </h4>
                <p className="text-3xs text-muted truncate">
                  {usuario?.email ?? 'admin@sorrisomineiro.com.br'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="justify-center"
              onClick={toggleTheme}
              title={
                resolvedTheme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'
              }
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  Tema
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Tema
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              className="justify-center"
              onClick={() => {
                void handleLogout();
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-default bg-surface/80 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <IconButton
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => {
                setMenuAberto(true);
              }}
              aria-label="Abrir menu lateral"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </IconButton>

            <div className="min-w-0">
              {titulo ? (
                <>
                  <h1 className="text-lg font-black leading-tight tracking-tight text-primary truncate">
                    {titulo}
                  </h1>
                  {subtitulo && (
                    <p className="hidden text-2xs text-muted sm:block truncate">{subtitulo}</p>
                  )}
                </>
              ) : (
                <span className="text-sm font-semibold text-secondary">Painel Administrativo</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {acoes}

            <div className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success px-3 py-1 text-2xs font-bold text-success-text sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              API Conectada
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
          <ScrollToTopButton containerRef={mainRef} />
        </main>
      </div>
    </div>
  );
}
