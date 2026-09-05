import { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '../lib/cn';
import type { StatusAgendamento } from '../services/admin.service';

export interface StatusOption {
  value: string;
  label: string;
  dotClass: string;
}

export const STATUS_FILTER_OPTIONS: StatusOption[] = [
  { value: '', label: 'Todos os status', dotClass: 'bg-slate-400 dark:bg-slate-500' },
  { value: 'PENDENTE', label: 'Pendente', dotClass: 'bg-amber-500' },
  { value: 'CONFIRMADO', label: 'Confirmado', dotClass: 'bg-emerald-500' },
  { value: 'CANCELADO', label: 'Cancelado', dotClass: 'bg-rose-500' },
  { value: 'ATENDIDO', label: 'Atendido', dotClass: 'bg-cyan-500' },
];

export const STATUS_ROW_OPTIONS = STATUS_FILTER_OPTIONS.filter((opt) => opt.value !== '');

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: StatusOption[];
  variant?: 'filter' | 'action';
  'aria-label'?: string;
}

export function StatusSelect({
  value,
  onChange,
  options = STATUS_FILTER_OPTIONS,
  variant = 'filter',
  'aria-label': ariaLabel,
}: StatusSelectProps): React.ReactNode {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selecionado = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    function handleClickFora(evento: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    if (aberto) {
      document.addEventListener('mousedown', handleClickFora);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [aberto]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setAberto(false);
        buttonRef.current?.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!aberto) {
          setAberto(true);
          return;
        }
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const nextIndex =
          e.key === 'ArrowDown'
            ? (currentIndex + 1) % options.length
            : (currentIndex - 1 + options.length) % options.length;
        onChange(options[nextIndex].value);
      }
    },
    [aberto, options, value, onChange],
  );

  const isAction = variant === 'action';

  return (
    <div
      className={cn('relative', isAction ? 'inline-block w-36' : 'w-full sm:w-52 shrink-0')}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setAberto((prev) => !prev);
        }}
        className={cn(
          'flex w-full items-center justify-between gap-1.5 truncate rounded-xl border bg-surface transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
          isAction
            ? 'px-2.5 py-1 text-xs font-semibold shadow-sm'
            : 'px-4 py-2 text-sm font-medium shadow-sm',
          aberto ? 'border-accent ring-2 ring-accent/20' : 'border-default hover:border-hover',
        )}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={ariaLabel || (isAction ? 'Alterar status' : 'Filtrar por status')}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span
            className={cn(
              'rounded-full shrink-0',
              isAction ? 'h-2 w-2' : 'h-2.5 w-2.5',
              selecionado.dotClass,
            )}
          />
          <span className="truncate text-primary">{selecionado.label}</span>
        </div>
        <svg
          className={cn(
            'shrink-0 text-muted transition-transform duration-200',
            isAction ? 'h-3 w-3' : 'h-4 w-4',
            aberto && 'rotate-180 text-accent',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {aberto && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full z-dropdown mt-1.5 w-full rounded-2xl border border-default bg-surface p-1.5 shadow-modal',
            'animate-in fade-in zoom-in-95 duration-150',
            isAction && 'p-1',
          )}
        >
          <ul role="listbox" className={cn('space-y-1', isAction && 'space-y-0.5')}>
            {options.map((opcao) => {
              const isSelected = opcao.value === value;
              return (
                <li key={opcao.value || 'all'} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opcao.value);
                      setAberto(false);
                      buttonRef.current?.focus();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between truncate rounded-xl transition-colors',
                      isAction
                        ? 'px-2.5 py-1.5 text-xs font-medium'
                        : 'px-3 py-2 text-xs font-semibold',
                      isSelected
                        ? 'bg-accent/10 font-bold text-accent'
                        : 'text-primary hover:bg-surface-hover',
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={cn(
                          'rounded-full shrink-0',
                          isAction ? 'h-2 w-2' : 'h-2.5 w-2.5',
                          opcao.dotClass,
                        )}
                      />
                      <span className="truncate">{opcao.label}</span>
                    </div>
                    {isSelected && (
                      <svg
                        className={cn('shrink-0 text-accent', isAction ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

interface StatusActionSelectProps {
  value: StatusAgendamento;
  onChange: (novoStatus: StatusAgendamento) => void;
}

export function StatusActionSelect({ value, onChange }: StatusActionSelectProps): React.ReactNode {
  return (
    <StatusSelect
      variant="action"
      value={value}
      options={STATUS_ROW_OPTIONS}
      onChange={(novo) => {
        onChange(novo as StatusAgendamento);
      }}
    />
  );
}

interface StatusFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusFilterSelect({ value, onChange }: StatusFilterSelectProps): React.ReactNode {
  return <StatusSelect variant="filter" value={value} onChange={onChange} />;
}
