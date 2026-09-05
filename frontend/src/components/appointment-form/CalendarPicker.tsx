import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../../lib/cn';

import { DIAS_SEMANA, MESES, formatarDataExibicao } from './utils';

interface CalendarPickerProps {
  valor: string;
  onChange: (dataIso: string) => void;
  erro?: string;
  desabilitado?: boolean;
  aberto: boolean;
  onToggle: (aberto: boolean) => void;
}

export function CalendarPicker({
  valor,
  onChange,
  erro,
  desabilitado = false,
  aberto,
  onToggle,
}: CalendarPickerProps): ReactNode {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickFora(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }

    if (aberto) {
      document.addEventListener('mousedown', handleClickFora);
      if (valor) {
        const [ano, mes] = valor.split('-').map(Number);
        if (ano && mes) {
          setAnoAtual(ano);
          setMesAtual(mes - 1);
        }
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [aberto, onToggle, valor]);

  const mesAnterior = (): void => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((prev) => prev - 1);
    } else {
      setMesAtual((prev) => prev - 1);
    }
  };

  const proximoMes = (): void => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((prev) => prev + 1);
    } else {
      setMesAtual((prev) => prev + 1);
    }
  };

  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDiasMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

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
        htmlFor="data-btn"
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Data da Consulta <span className="text-danger">*</span>
      </label>

      {/* Gatilho do Calendário */}
      <button
        ref={triggerRef}
        id="data-btn"
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={cn(valor ? 'font-bold text-primary' : 'text-muted font-normal')}>
            {valor ? formatarDataExibicao(valor) : 'Selecione a data no calendário...'}
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

      {/* Popup do Calendário Interativo */}
      {aberto && (
        <div
          role="dialog"
          aria-label="Calendário para escolha de data"
          onKeyDown={handleKeyDownPopup}
          className="absolute top-full left-0 right-0 z-50 mt-2 w-full rounded-2xl border border-subtle bg-surface p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Cabeçalho do Mês / Navegação */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={mesAnterior}
              aria-label="Mês anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-hover text-secondary transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="font-bold text-primary text-sm">
              {MESES[mesAtual]} de {anoAtual}
            </span>

            <button
              type="button"
              onClick={proximoMes}
              aria-label="Próximo mês"
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-hover text-secondary transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Dias da Semana */}
          <div
            className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted mb-2"
            aria-hidden="true"
          >
            {DIAS_SEMANA.map((dia, idx) => (
              <span key={idx} className={cn(idx === 0 && 'text-rose-400')}>
                {dia}
              </span>
            ))}
          </div>

          {/* Matriz dos Dias */}
          <div
            className="grid grid-cols-7 gap-1 text-center text-xs"
            role="grid"
            aria-label="Dias do mês"
          >
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
              <span key={`vazio-${String(i)}`} aria-hidden="true" />
            ))}

            {Array.from({ length: totalDiasMes }).map((_, i) => {
              const numeroDia = i + 1;
              const diaFormatado = String(numeroDia).padStart(2, '0');
              const mesFormatado = String(mesAtual + 1).padStart(2, '0');
              const dataIso = `${String(anoAtual)}-${mesFormatado}-${diaFormatado}`;
              const dataObj = new Date(anoAtual, mesAtual, numeroDia);
              const hojeFormatado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

              const noPassado = dataObj < hojeFormatado;
              const eDomingo = dataObj.getDay() === 0;
              const desabilitadoDia = noPassado || eDomingo;
              const selecionado = valor === dataIso;
              const eHoje = dataObj.getTime() === hojeFormatado.getTime();

              return (
                <button
                  key={dataIso}
                  type="button"
                  disabled={desabilitadoDia}
                  aria-selected={selecionado}
                  aria-current={eHoje ? 'date' : undefined}
                  aria-label={`${String(numeroDia)} de ${MESES[mesAtual]} de ${String(anoAtual)}${eHoje ? ', hoje' : ''}${desabilitadoDia ? ', indisponível' : ''}${selecionado ? ', selecionado' : ''}`}
                  onClick={() => {
                    onChange(dataIso);
                    onToggle(false);
                    triggerRef.current?.focus();
                  }}
                  className={cn(
                    'h-9 w-full flex items-center justify-center rounded-xl font-semibold transition-all',
                    selecionado
                      ? 'bg-accent text-white font-bold shadow-md ring-2 ring-accent/30 scale-105'
                      : desabilitadoDia
                        ? 'text-border-default cursor-not-allowed opacity-40'
                        : eHoje
                          ? 'border-2 border-accent text-accent hover:bg-accent/10'
                          : 'text-secondary hover:bg-accent/10 hover:text-accent',
                  )}
                >
                  {numeroDia}
                </button>
              );
            })}
          </div>

          {/* Rodapé com atalhos */}
          <div className="mt-3 pt-3 border-t border-subtle flex items-center justify-between text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                onChange('');
                onToggle(false);
                triggerRef.current?.focus();
              }}
              className="text-muted hover:text-primary"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => {
                const diaFmt = String(hoje.getDate()).padStart(2, '0');
                const mesFmt = String(hoje.getMonth() + 1).padStart(2, '0');
                const dataHojeIso = `${String(hoje.getFullYear())}-${mesFmt}-${diaFmt}`;
                onChange(dataHojeIso);
                onToggle(false);
                triggerRef.current?.focus();
              }}
              className="text-accent hover:text-accent-hover font-bold"
            >
              Hoje
            </button>
          </div>
        </div>
      )}

      {erro && <p className="text-xs font-semibold text-danger">{erro}</p>}
    </div>
  );
}
