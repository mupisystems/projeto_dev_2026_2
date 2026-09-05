import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../lib/cn.js';

import { ThemeToggle } from './ThemeToggle.js';
import { Button } from './ui/Button.js';

const NAV_ITENS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'A Clínica' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'procedimentos', label: 'Procedimentos' },
  { id: 'depoimentos', label: 'Avaliações' },
  { id: 'faq', label: 'Dúvidas' },
];

// Header principal fixo com Scrollspy, rolagem suave com compensação de offset e URLs limpas (sem hashes).

export function Header(): React.ReactNode {
  const [menuAberto, setMenuAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<string>('inicio');
  const navItens = useMemo(() => NAV_ITENS, []);

  useEffect(() => {
    const ids = navItens.map((item) => item.id);
    let rafId: number | null = null;

    const calcularSecaoAtiva = (): void => {
      const scrollY = window.scrollY;
      const offsetTop = scrollY + 140;

      let atual = '';

      for (const id of ids) {
        const elemento = document.getElementById(id);
        if (elemento) {
          const topo = elemento.offsetTop;
          const altura = elemento.offsetHeight;

          if (offsetTop >= topo && offsetTop < topo + altura) {
            atual = id;
          }
        }
      }

      setSecaoAtiva((anterior) => (anterior === atual ? anterior : atual));
    };

    const handleScroll = (): void => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calcularSecaoAtiva();
        rafId = null;
      });
    };

    calcularSecaoAtiva();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [navItens]);

  const rolarParaSecao = (evento: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    evento.preventDefault();
    setMenuAberto(false);

    const elemento = document.getElementById(id);
    if (elemento) {
      const yOffset = -70;
      const y = elemento.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-header w-full">
      {/* Barra superior */}
      <div className="bg-petroleo-dark text-white text-2xs sm:text-xs py-1.5 sm:py-2 px-4 border-b border-white/10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-white">
              <svg
                className="h-3.5 w-3.5 text-cyan-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Seg a Sex: 08h às 19h • Sáb: 08h às 13h
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-white">
              <svg
                className="h-3.5 w-3.5 text-cyan-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Montes Claros - MG
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5538900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-cyan-200 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              (38) 90000-0000
            </a>
            <span className="text-white/40">|</span>
            <Link
              to="/admin/login"
              className="text-white hover:text-cyan-200 transition-colors font-semibold"
            >
              Área Restrita
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de navegação principal */}
      <nav className="border-b border-default bg-surface shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              rolarParaSecao(e, 'inicio');
            }}
            className="group flex items-center gap-3"
          >
            <img
              src="/images/logo.png"
              alt="Sorriso Mineiro Logo"
              className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="block text-lg font-extrabold leading-tight tracking-tight text-primary">
                Sorriso Mineiro
              </span>
              <p className="text-2xs font-medium text-muted">Clínica Odontológica Especializada</p>
            </div>
          </a>

          {/* Links desktop */}
          <div className="hidden items-center gap-6 lg:gap-7 md:flex">
            {navItens.map((item) => {
              const eAtivo = secaoAtiva === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    rolarParaSecao(e, item.id);
                  }}
                  className={cn(
                    'group relative py-2 text-sm font-semibold transition-colors',
                    eAtivo ? 'text-accent' : 'text-secondary hover:text-accent',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ease-out',
                      eAtivo ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </a>
              );
            })}
          </div>

          {/* Ações desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                rolarParaSecao(e as unknown as React.MouseEvent<HTMLAnchorElement>, 'agendar');
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Agendar Consulta
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                setMenuAberto(!menuAberto);
              }}
              className="rounded-xl p-2 text-secondary transition-colors hover:bg-surface-hover hover:text-primary"
              aria-label="Abrir menu de navegação"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuAberto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer mobile */}
        {menuAberto && (
          <div className="border-t border-default bg-surface px-4 py-4 space-y-2 shadow-lg md:hidden">
            {navItens.map((item) => {
              const eAtivo = secaoAtiva === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    rolarParaSecao(e, item.id);
                  }}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    eAtivo
                      ? 'bg-accent/10 font-bold text-accent'
                      : 'text-primary hover:bg-surface-hover hover:text-accent',
                  )}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#agendar"
              onClick={(e) => {
                rolarParaSecao(e, 'agendar');
              }}
              className="block w-full text-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-accent-hover"
            >
              Agendar Consulta Agora
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
