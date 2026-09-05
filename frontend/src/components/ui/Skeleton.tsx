import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn.js';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactNode {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80 dark:bg-[#222E32]/80', className)}
      {...props}
    />
  );
}

/**
 * Skeleton para os 4 cards de KPIs da Dashboard, Agenda e Pacientes
 */
export function KpiGridSkeleton({ count = 4 }: { count?: number }): React.ReactNode {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={String(i)}
          className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-[#1F2B2E] dark:bg-[#141C1E]"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-9 rounded-2xl" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para tabelas administrativas
 */
export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}): React.ReactNode {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-[#1F2B2E]">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-[#1F2B2E] dark:bg-[#1B2528]">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48 rounded-xl" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-[#1F2B2E]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={String(r)} className="flex items-center justify-between p-4 gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={String(c)}
                className={cn('h-4', c === 0 ? 'w-36' : c === 1 ? 'w-28' : 'w-20')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton para slots de horários da Agenda Clínica
 */
export function AgendaGridSkeleton({ count = 6 }: { count?: number }): React.ReactNode {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={String(i)}
          className="flex flex-col md:flex-row md:items-stretch gap-3 rounded-2xl p-4 border border-slate-200/80 bg-slate-50/80 dark:border-[#222E32] dark:bg-[#1B2528]/80"
        >
          <div className="flex md:flex-col items-center justify-between md:justify-center md:w-24 shrink-0 pr-0 md:pr-4 md:border-r border-slate-200/80 dark:border-[#222E32] space-y-1">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex-1 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-7 w-20 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
