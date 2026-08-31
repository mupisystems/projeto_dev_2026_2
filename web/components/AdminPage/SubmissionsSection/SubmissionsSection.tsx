"use client";

import type { FormEvent } from "react";
import type { Submission, SubmissionResponse } from "@/lib/api";
import { formatDate, statusClass, statusLabel } from "../types";

type Props = {
  result: SubmissionResponse;
  status: string;
  search: string;
  page: number;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStatusChange: (value: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onChangeStatus: (item: Submission, nextStatus: "confirmed" | "cancelled") => void;
};

export default function SubmissionsSection({ result, status, search, page, loading, onSearchChange, onSearchSubmit, onStatusChange, onPreviousPage, onNextPage, onChangeStatus }: Props) {
  return <section className="mt-14"><div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 md:flex-row md:items-end"><div><p className="eyebrow">Inbox</p><p className="mt-2 text-sm text-fog">{result.pagination.total} propostas no total</p></div><form onSubmit={onSearchSubmit} className="flex w-full gap-2 md:w-auto"><input className="field min-w-0 md:w-64" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar nome ou email" /><button className="button-secondary" type="submit">Buscar</button></form></div><div className="flex gap-2 overflow-auto py-5"><FilterButton active={!status} onClick={() => onStatusChange("")}>Todas</FilterButton>{["pending", "confirmed", "cancelled"].map((item) => <FilterButton key={item} active={status === item} onClick={() => onStatusChange(item)}>{statusLabel[item]}</FilterButton>)}</div><div className={`overflow-x-auto ${loading ? "opacity-50" : ""}`}><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[.18em] text-fog"><th className="px-4 py-4">Proposta</th><th className="px-4 py-4">Formato</th><th className="px-4 py-4">Data</th><th className="px-4 py-4">Status</th><th className="px-4 py-4 text-right">Ações</th></tr></thead><tbody>{result.data.length === 0 ? <tr><td colSpan={5} className="px-4 py-16 text-center text-sm text-fog">Nenhuma proposta encontrada.</td></tr> : result.data.map((item) => <SubmissionRow key={item.id} item={item} onChangeStatus={onChangeStatus} />)}</tbody></table></div><div className="mt-5 flex items-center justify-between"><p className="text-xs text-fog">Página {result.pagination.page} de {Math.max(1, result.pagination.pages)}</p><div className="flex gap-2"><button className="button-secondary disabled:opacity-30" disabled={page <= 1} onClick={onPreviousPage}>← Anterior</button><button className="button-secondary disabled:opacity-30" disabled={page >= result.pagination.pages} onClick={onNextPage}>Próxima →</button></div></div></section>;
}

function SubmissionRow({ item, onChangeStatus }: { item: Submission; onChangeStatus: Props["onChangeStatus"] }) {
  return <tr className="border-b border-white/10 align-top"><td className="px-4 py-6"><p className="font-bold">{item.brand_name}</p><p className="mt-1 text-sm text-fog">{item.email} · {item.instagram}</p><p className="mt-3 max-w-md text-sm leading-5 text-white/60">{item.pitch}</p>{item.logs && item.logs.length > 0 && <p className="mt-3 text-[10px] uppercase tracking-[.13em] text-fog">Histórico: {item.logs.map((log) => `${statusLabel[log.to_status]} · ${formatDate(log.changed_at.slice(0, 10))}`).join(" / ")}</p>}</td><td className="px-4 py-6 text-sm text-white/70">{item.collab_type}</td><td className="px-4 py-6 text-sm text-white/70">{formatDate(item.proposed_date)}</td><td className="px-4 py-6"><span className={`status-pill ${statusClass[item.status]}`}>{statusLabel[item.status]}</span></td><td className="px-4 py-6 text-right">{item.status === "pending" && <div className="flex justify-end gap-2"><button className="button-secondary border-emerald-400/30 text-emerald-300" onClick={() => onChangeStatus(item, "confirmed")}>Confirmar</button><button className="button-secondary border-red-400/30 text-red-300" onClick={() => onChangeStatus(item, "cancelled")}>Cancelar</button></div>}</td></tr>;
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`whitespace-nowrap px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] ${active ? "bg-white text-ink" : "border border-white/15 text-fog"}`}>{children}</button>; }
