import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { formatarDataExibicao } from '../../schemas/agendamento.schema';
import type { AgendamentoAdmin, StatusAgendamento } from '../../services/admin.service';
import { StatusActionSelect } from '../CustomSelect';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';

interface AppointmentTableProps {
  agendamentos: AgendamentoAdmin[];
  carregando: boolean;
  temFiltro: boolean;
  onStatusChange: (id: string, status: StatusAgendamento) => void;
}

export function AppointmentTable({
  agendamentos,
  carregando,
  temFiltro,
  onStatusChange,
}: AppointmentTableProps): ReactNode {
  if (carregando && agendamentos.length === 0) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (agendamentos.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
        title="Nenhum agendamento encontrado"
        description={
          temFiltro
            ? 'Não foram encontrados agendamentos para os filtros aplicados. Tente limpar a busca.'
            : 'Nenhum paciente realizou agendamento ainda. Os novos registros enviados pelo formulário público aparecerão aqui.'
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-default">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-default bg-inset">
            <tr>
              <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-wider text-secondary">
                Paciente
              </th>
              <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-wider text-secondary">
                Procedimento
              </th>
              <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-wider text-secondary">
                Data & Horário
              </th>
              <th className="px-4 py-3.5 text-2xs font-bold uppercase tracking-wider text-secondary">
                Status
              </th>
              <th className="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-secondary">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-surface">
            {agendamentos.map((agendamento) => {
              const foneLimpo = agendamento.telefone?.replace(/\D/g, '');
              return (
                <tr key={agendamento.id} className="group transition-colors hover:bg-inset/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={agendamento.nome} />
                      <div className="min-w-0">
                        <div className="font-bold text-primary truncate">{agendamento.nome}</div>
                        <div className="flex items-center gap-2 truncate text-2xs text-muted">
                          <span>{agendamento.email}</span>
                          {agendamento.telefone && (
                            <>
                              <span>•</span>
                              <a
                                href={`https://wa.me/55${foneLimpo ?? ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                title="Abrir WhatsApp"
                              >
                                {agendamento.telefone}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="inline-flex flex-col">
                      <span className="font-semibold text-primary">
                        {agendamento.procedimento?.titulo ?? 'Consulta Odontológica'}
                      </span>
                      {agendamento.procedimento?.preco && (
                        <span className="text-2xs text-muted">
                          R$ {parseFloat(agendamento.procedimento.preco).toFixed(2)} •{' '}
                          {agendamento.procedimento.duracaoMinutos} min
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
                        {formatarDataExibicao(agendamento.data)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold text-accent">
                        <svg
                          className="h-3 w-3"
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
                        {agendamento.horario}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusActionSelect
                      value={agendamento.status as StatusAgendamento}
                      onChange={(novoStatus) => {
                        onStatusChange(agendamento.id, novoStatus);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={`/admin/agendamentos/${agendamento.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-inset px-3 py-1.5 text-2xs font-bold text-accent transition-all hover:bg-accent hover:text-white"
                    >
                      Detalhes
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
