import type { Submission } from "@/lib/api";

export type SubmissionStatus = Submission["status"];

export const statusLabel: Record<string, string> = { pending: "Pendente", confirmed: "Confirmado", cancelled: "Cancelado" };
export const statusClass: Record<string, string> = { pending: "bg-amber-400/10 text-amber-300", confirmed: "bg-emerald-400/10 text-emerald-300", cancelled: "bg-red-400/10 text-red-300" };
export const formatDate = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
