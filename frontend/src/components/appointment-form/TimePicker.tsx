import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { gerarHorarios } from '../../schemas/agendamento.schema';

interface TimePickerProps {
  valor: string;
  onChange: (horario: string) => void;
  erro?: string;
  desabilitado?: boolean;
  aberto: boolean;
  onToggle: (aberto: boolean) => void;
}

export function TimePicker({
  valor,
  onChange,
  erro,
  desabilitado = false,
  aberto,
  onToggle,
}: TimePickerProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const horarios = gerarHorarios();
  const horariosManha = horarios.filter((h) => {
    const hora = Number.parseInt(h.split(':')[0], 10);
    return hora < 12;
  });
  const horariosTarde = horarios.filter((h) => {
    const hora = Number.parseInt(h.split(':')[0], 10);
    return hora >= 12;
  });

  useEffect(() => {
    function handleClickFora(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }

    if (aberto) {
      document.addEventListener('mousedown', handleClickFora);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [aberto, onToggle]);

  const handleKeyDownPopup = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onToggle(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label
        htmlFor="horario-btn"
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Horário Desejado <span className="text-danger">*</span>
      </label>

      {/* Gatilho do Seletor de Horário */}
      <button
        ref={triggerRef}
        id="horario-btn"
        type="button"
        disabled={desabilitado}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        onClick={() => {
          onToggle(!aberto);
        }}
        className={cn(
          'w-full flex items-center justify-between rounded-xl border bg-surface px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:bg-inset',
          aberto
            ? 'border-accent ring-2 ring-accent/20 shadow-md'
            : erro
              ? 'border-danger bg-danger/10'
              : 'border-default hover:border-accent',
        )}
      >
        <div className="flex items-center gap-2.5 text-secondary">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={cn(valor ? 'font-bold text-primary' : 'text-muted font-normal')}>
            {valor ? `${valor} horas` : 'Selecione o horário...'}
          </span>
        </div>
        <svg
          className={cn(
            'h-4 w-4 text-muted transition-transform duration-300',
            aberto && 'rotate-180 text-accent',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popup com Chips de Horários por Turno */}
      {aberto && (
        <div
          role="dialog"
          aria-label="Seleção de horários disponíveis"
          onKeyDown={handleKeyDownPopup}
          className="absolute top-full left-0 right-0 z-50 mt-2 w-full rounded-2xl border border-subtle bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        >
          <div className="max-h-80 overflow-y-auto p-4 space-y-4 overscroll-contain">
            {/* Turno da Manhã */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary mb-2">
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>Período da Manhã</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {horariosManha.map((h) => {
                  const selecionado = valor === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      aria-selected={selecionado}
                      onClick={() => {
                        onChange(h);
                        onToggle(false);
                        triggerRef.current?.focus();
                      }}
                      className={cn(
                        'py-2 px-1 rounded-xl text-xs font-bold transition-all border',
                        selecionado
                          ? 'bg-accent text-white shadow-md ring-2 ring-accent/30'
                          : 'bg-surface-hover text-secondary hover:bg-accent/10 hover:text-accent hover:border-accent/30 border-subtle',
                      )}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Turno da Tarde */}
            <div className="pt-2 border-t border-subtle">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary mb-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Período da Tarde</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {horariosTarde.map((h) => {
                  const selecionado = valor === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      aria-selected={selecionado}
                      onClick={() => {
                        onChange(h);
                        onToggle(false);
                        triggerRef.current?.focus();
                      }}
                      className={cn(
                        'py-2 px-1 rounded-xl text-xs font-bold transition-all border',
                        selecionado
                          ? 'bg-accent text-white shadow-md ring-2 ring-accent/30'
                          : 'bg-surface-hover text-secondary hover:bg-accent/10 hover:text-accent hover:border-accent/30 border-subtle',
                      )}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {erro && <p className="text-xs font-semibold text-danger">{erro}</p>}
    </div>
  );
}
