import type { Procedimento } from '@prisma/client';

export interface ProcedimentoDto {
  id: string;
  titulo: string;
  ativa: boolean;
  preco: string | null;
  duracaoMinutos: number | null;
  criadoEm: string;
  atualizadoEm: string;
}

export function toProcedimentoDto(p: Procedimento): ProcedimentoDto {
  return {
    id: p.id,
    titulo: p.titulo,
    ativa: p.ativa,
    preco: p.preco !== null ? p.preco.toString() : null,
    duracaoMinutos: p.duracaoMinutos,
    criadoEm: p.criadoEm instanceof Date ? p.criadoEm.toISOString() : String(p.criadoEm),
    atualizadoEm:
      p.atualizadoEm instanceof Date ? p.atualizadoEm.toISOString() : String(p.atualizadoEm),
  };
}
