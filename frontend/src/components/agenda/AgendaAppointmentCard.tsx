import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/cn';
import { formatarDataExibicao } from '../../schemas/agendamento.schema';
import type {
  AgendamentoAdmin,
  Procedimento,
  StatusAgendamento,
} from '../../services/admin.service';
import { StatusActionSelect } from '../CustomSelect';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface AgendaAppointmentCardProps {
  agendamento: AgendamentoAdmin;
  procedimentos: Procedimento[];
  filtroStatus: string;
  onStatusChange: (id: string, status: StatusAgendamento) => void;
}

export function AgendaAppointmentCard({
  agendamento,
  procedimentos,
  filtroStatus,
  onStatusChange,
}: AgendaAppointmentCardProps): ReactNode {
  const coincideComFiltro = filtroStatus ? agendamento.status === filtroStatus : true;
  const foneLimpo = agendamento.telefone?.replace(/\D/g, '');
  const proc =
    agendamento.procedimento || procedimentos.find((p) => p.id === agendamento.procedimentoId);

  return (
    <div
      className={cn(
        'rounded-2xl p-4 shadow-sm border border-default bg-surface transition-all hover:shadow-card',
        agendamento.status === 'CONFIRMADO' && 'border-l-4 border-l-success',
        agendamento.status === 'PENDENTE' && 'border-l-4 border-l-warning',
        agendamento.status === 'ATENDIDO' && 'border-l-4 border-l-info',
        agendamento.status === 'CANCELADO' && 'border-l-4 border-l-danger bg-surface/60',
        !coincideComFiltro && 'opacity-40 grayscale-[25%] hover:opacity-100 hover:grayscale-0',
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Info do Paciente */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={agendamento.nome} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-primary truncate">{agendamento.nome}</h3>
              <span className="hidden sm:inline-block text-xs text-muted">
                • {agendamento.email}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-secondary mt-0.5">
              <span className="font-semibold text-accent">
                {proc?.titulo ?? 'Consulta Odontológica'}
              </span>
              {proc?.duracaoMinutos && (
                <Badge variant="neutral" className="gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {proc.duracaoMinutos} min
                </Badge>
              )}
              {proc?.preco && (
                <span className="text-primary font-medium">
                  R$ {Number(proc.preco).toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ações Rápidas no Card */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-subtle">
          {foneLimpo && (
            <a
              href={`https://wa.me/55${foneLimpo}?text=${encodeURIComponent(
                `Olá ${agendamento.nome}, aqui é da Clínica Odontológica Sorriso Mineiro! Confirmamos sua consulta para ${formatarDataExibicao(
                  agendamento.data,
                )} às ${agendamento.horario}. Qualquer dúvida estamos à disposição!`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-button bg-success px-2.5 py-1.5 text-xs font-bold text-success-text hover:bg-emerald-500 hover:text-white transition-all"
              title={`Conversar com ${agendamento.nome} no WhatsApp`}
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.128-.519-1.834-.757-3.018-2.627-3.11-2.748-.09-.12-0.738-.983-.738-1.873 0-.89.468-1.328.636-1.508.168-.18.366-.225.486-.225.12 0 .24.002.345.006.11.006.26-.041.408.312.152.366.52 1.267.565 1.359.045.092.075.2.015.32-.06.12-.09.195-.18.3-.09.105-.19.234-.27.315-.09.09-.185.187-.08.367.105.18.468.772 1.004 1.249.69.614 1.272.805 1.452.895.18.09.285.075.39-.045s.45-.525.57-.705.24-.15.405-.09c.165.06 1.05.495 1.23.585.18.09.3.135.345.21.045.075.045.435-.099.84z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          )}

          <StatusActionSelect
            value={agendamento.status as StatusAgendamento}
            onChange={(novoStatus) => {
              onStatusChange(agendamento.id, novoStatus);
            }}
          />

          <Link
            to={`/admin/agendamentos/${agendamento.id}`}
            className="rounded-button border border-default bg-surface px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all"
          >
            Ver Ficha
          </Link>
        </div>
      </div>

      {/* Observações do Paciente */}
      {agendamento.observacao && (
        <div className="mt-2.5 rounded-xl bg-inset p-2 text-xs text-secondary border border-subtle">
          <strong className="text-primary">Nota: </strong>
          {agendamento.observacao}
        </div>
      )}
    </div>
  );
}
