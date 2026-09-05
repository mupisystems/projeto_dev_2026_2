import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function DashboardBanner(): ReactNode {
  const dataHojeFormatada = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const dataCapitalizada = dataHojeFormatada.charAt(0).toUpperCase() + dataHojeFormatada.slice(1);

  return (
    <Card variant="gradient" className="relative overflow-hidden p-6 sm:p-8 shadow-xl">
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Painel Clínico Inteligente
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Olá, Administrador 👋
          </h2>
          <p className="mt-1 text-2xs font-medium text-white/90 sm:text-xs">
            {dataCapitalizada} • Clínica Sorriso Mineiro em operação normal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 bg-white/10 text-white hover:bg-white/20"
            asChild
          >
            <Link to="/admin/procedimentos">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo Procedimento
            </Link>
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-button bg-white px-4 py-2.5 text-2xs font-bold text-accent hover:bg-surface transition-all shadow-md"
          >
            Ver Página
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-40 -top-20 h-48 w-48 rounded-full bg-primary-accent/20 blur-2xl" />
    </Card>
  );
}
