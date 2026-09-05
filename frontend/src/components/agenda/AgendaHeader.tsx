import type { ReactNode } from 'react';

import { StatusFilterSelect } from '../CustomSelect';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';
import { Input } from '../ui/Input';

interface AgendaHeaderProps {
  dataSelecionada: string;
  onDataChange: (data: string) => void;
  dataExtenso: { texto: string; isHoje: boolean };
  onMudarDia: (delta: number) => void;
  onIrParaHoje: () => void;
  modoVisualizacao: 'dia' | 'semana';
  onModoChange: (modo: 'dia' | 'semana') => void;
  filtroStatus: string;
  onFiltroStatusChange: (status: string) => void;
}

export function AgendaHeader({
  dataSelecionada,
  onDataChange,
  dataExtenso,
  onMudarDia,
  onIrParaHoje,
  modoVisualizacao,
  onModoChange,
  filtroStatus,
  onFiltroStatusChange,
}: AgendaHeaderProps): ReactNode {
  return (
    <Card variant="outlined" className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Navegação de Data */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center rounded-2xl border border-default bg-inset p-1">
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onMudarDia(-1);
              }}
              title="Dia anterior"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </IconButton>

            <Button
              type="button"
              variant={dataExtenso.isHoje ? 'primary' : 'ghost'}
              size="sm"
              onClick={onIrParaHoje}
            >
              Hoje
            </Button>

            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onMudarDia(1);
              }}
              title="Próximo dia"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </IconButton>
          </div>

          <Input
            type="date"
            value={dataSelecionada}
            onChange={(e) => {
              if (e.target.value) onDataChange(e.target.value);
            }}
            className="w-auto max-w-[170px] px-3.5 py-2 text-xs font-bold"
          />

          <div className="hidden xl:flex items-center gap-2 pl-2">
            <span className="text-sm font-black text-primary">{dataExtenso.texto}</span>
            {dataExtenso.isHoje && <Badge variant="success">Dia Atual</Badge>}
          </div>
        </div>

        {/* Alternadores de Modo e Filtro */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-2xl border border-default bg-inset p-1">
            <Button
              type="button"
              variant={modoVisualizacao === 'dia' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                onModoChange('dia');
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Grade Diária
            </Button>

            <Button
              type="button"
              variant={modoVisualizacao === 'semana' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                onModoChange('semana');
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Visão Semanal
            </Button>
          </div>

          <StatusFilterSelect value={filtroStatus} onChange={onFiltroStatusChange} />
        </div>
      </div>
    </Card>
  );
}
