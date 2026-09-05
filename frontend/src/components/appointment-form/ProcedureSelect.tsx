import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../../lib/cn';
import type { Procedimento } from '../../services/api';

import { formatarTitulo, obterIcone } from './utils';

interface ProcedureSelectProps {
  procedimentos: Procedimento[];
  valor: string;
  onChange: (id: string) => void;
  erro?: string;
  desabilitado?: boolean;
  aberto: boolean;
  onToggle: (aberto: boolean) => void;
}

export function ProcedureSelect({
  procedimentos,
  valor,
  onChange,
  erro,
  desabilitado = false,
  aberto,
  onToggle,
}: ProcedureSelectProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [focoIndice, setFocoIndice] = useState(-1);

  const selecionado = procedimentos.find((p) => p.id === valor);

  useEffect(() => {
    function handleClickFora(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }

    if (aberto) {
      document.addEventListener('mousedown', handleClickFora);
      const indiceInicial = procedimentos.findIndex((p) => p.id === valor);
      setFocoIndice(indiceInicial >= 0 ? indiceInicial : 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [aberto, onToggle, procedimentos, valor]);

  const handleKeyDownTrigger = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      onToggle(true);
    }
  };

  const handleKeyDownLista = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onToggle(false);
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocoIndice((prev) => (prev < procedimentos.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocoIndice((prev) => (prev > 0 ? prev - 1 : procedimentos.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focoIndice >= 0 && focoIndice < procedimentos.length) {
        onChange(procedimentos[focoIndice].id);
        onToggle(false);
        triggerRef.current?.focus();
      }
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label
        htmlFor="procedimento-btn"
        className="flex items-center gap-1.5 text-sm font-bold text-primary"
      >
        <svg
          className="h-4 w-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Procedimento Desejado <span className="text-danger">*</span>
      </label>

      {/* Gatilho do Dropdown Customizado */}
      <button
        ref={triggerRef}
        id="procedimento-btn"
        type="button"
        disabled={desabilitado}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls="procedimentos-listbox"
        onKeyDown={handleKeyDownTrigger}
        onClick={() => {
          onToggle(!aberto);
        }}
        className={cn(
          'w-full flex items-center justify-between rounded-2xl border bg-surface p-3.5 sm:p-4 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:bg-inset',
          aberto
            ? 'border-accent ring-2 ring-accent/20 shadow-md'
            : erro
              ? 'border-danger bg-danger/10'
              : 'border-default hover:border-accent',
        )}
      >
        {selecionado ? (
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold border border-accent/20 shadow-sm">
              {obterIcone(selecionado.titulo)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary text-sm sm:text-base">
                  {formatarTitulo(selecionado.titulo)}
                </span>
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                  {selecionado.preco
                    ? `R$ ${Number(selecionado.preco).toFixed(2).replace('.', ',')}`
                    : 'Sob consulta'}
                </span>
              </div>
              <p className="text-xs text-muted font-medium mt-0.5">
                Duração estimada: ~{selecionado.duracaoMinutos} minutos
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted text-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-muted">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <span>Selecione um procedimento na lista...</span>
          </div>
        )}

        <div className="ml-3 shrink-0 text-muted transition-transform duration-300">
          <svg
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              aberto && 'rotate-180 text-accent',
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Menu Flutuante Customizado */}
      {aberto && (
        <div
          id="procedimentos-listbox"
          role="listbox"
          aria-label="Procedimentos disponíveis"
          tabIndex={-1}
          onKeyDown={handleKeyDownLista}
          className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-subtle bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
            {procedimentos.map((p, idx) => {
              const ehSelecionado = p.id === valor;
              const ehFocado = idx === focoIndice;
              const titulo = formatarTitulo(p.titulo);

              return (
                <button
                  key={p.id}
                  id={`procedimento-opt-${p.id}`}
                  role="option"
                  aria-selected={ehSelecionado}
                  type="button"
                  onClick={() => {
                    onChange(p.id);
                    onToggle(false);
                    triggerRef.current?.focus();
                  }}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl p-3 text-left transition-all border',
                    ehSelecionado
                      ? 'bg-accent/10 text-accent border-accent/30 shadow-sm'
                      : ehFocado
                        ? 'bg-surface-hover border-accent/40 text-primary'
                        : 'hover:bg-surface-hover text-secondary hover:border-subtle border-transparent',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                        ehSelecionado
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-accent/10 text-accent',
                      )}
                    >
                      {obterIcone(p.titulo)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">{titulo}</h4>
                      <p className="text-xs text-muted">
                        ~{p.duracaoMinutos} min •{' '}
                        {p.preco
                          ? `R$ ${Number(p.preco).toFixed(2).replace('.', ',')}`
                          : 'Sob consulta'}
                      </p>
                    </div>
                  </div>
                  {ehSelecionado && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {erro && <p className="text-xs font-semibold text-danger">{erro}</p>}
    </div>
  );
}
