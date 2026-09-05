import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AdminLayout } from '../components/AdminLayout.js';
import { StatusActionSelect } from '../components/CustomSelect.js';
import { Avatar } from '../components/ui/Avatar.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { useToast } from '../contexts/ToastContext.js';
import { formatarDataExibicao } from '../schemas/agendamento.schema.js';
import {
  adminApi,
  type AgendamentoDetalhe,
  type StatusAgendamento,
} from '../services/admin.service.js';

export function AppointmentDetailPage(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [detalhe, setDetalhe] = useState<AgendamentoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = useCallback(async (): Promise<void> => {
    if (!id) {
      setErro('ID do agendamento não informado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const resposta = await adminApi.buscarAgendamento(id);
      setDetalhe(resposta);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao carregar os detalhes do agendamento.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const handleStatusChange = async (novoStatus: StatusAgendamento): Promise<void> => {
    if (!id || !detalhe) return;
    try {
      await adminApi.atualizarStatus(id, novoStatus);
      toast.success(`Status atualizado para ${novoStatus} com sucesso!`);
      await carregarDados();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao alterar status.';
      setErro(mensagem);
      toast.error(mensagem);
    }
  };

  const foneLimpo = detalhe?.telefone?.replace(/\D/g, '');

  const badgeVariant =
    detalhe?.status === 'CONFIRMADO'
      ? 'success'
      : detalhe?.status === 'PENDENTE'
        ? 'warning'
        : detalhe?.status === 'ATENDIDO'
          ? 'info'
          : 'danger';

  return (
    <AdminLayout
      titulo="Ficha do Agendamento"
      subtitulo="Visualização detalhada dos dados do paciente e histórico completo de auditoria."
      acoes={
        <div className="flex items-center gap-2 shrink-0">
          {detalhe && (
            <StatusActionSelect
              value={detalhe.status as StatusAgendamento}
              onChange={(novo) => {
                void handleStatusChange(novo);
              }}
            />
          )}
          <Button variant="secondary" size="sm" asChild>
            <Link to="/admin" title="Voltar ao Painel">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Voltar</span>
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {erro && (
          <div
            className="rounded-card border border-danger bg-danger p-4 text-sm text-danger"
            role="alert"
          >
            {erro}
          </div>
        )}

        {carregando && !detalhe && (
          <div className="py-20 text-center text-muted">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm font-semibold">Carregando ficha do paciente...</p>
          </div>
        )}

        {detalhe && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna 1 & 2: Dados do Paciente e Procedimento */}
            <div className="space-y-6 lg:col-span-2">
              {/* Card de Identificação do Paciente */}
              <Card variant="elevated">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={detalhe.nome} size="lg" />
                    <div>
                      <h2 className="text-xl font-black text-primary">{detalhe.nome}</h2>
                      <p className="text-xs text-muted mt-0.5">
                        ID: <span className="font-mono text-2xs">{detalhe.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant={badgeVariant}>{detalhe.status}</Badge>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mt-6">
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                      E-mail do Paciente
                    </span>
                    <p className="text-sm font-semibold text-primary mt-1">{detalhe.email}</p>
                  </div>

                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                      Telefone / WhatsApp
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm font-semibold text-primary">
                        {detalhe.telefone || 'Não informado'}
                      </p>
                      {foneLimpo && (
                        <a
                          href={`https://wa.me/55${foneLimpo}?text=${encodeURIComponent(
                            `Olá ${detalhe.nome}, aqui é da Clínica Odontológica Sorriso Mineiro! Estamos em contato sobre sua consulta marcada para ${formatarDataExibicao(
                              detalhe.data,
                            )} às ${detalhe.horario}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-button bg-success px-2.5 py-1 text-xs font-bold text-success-text hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.128-.519-1.834-.757-3.018-2.627-3.11-2.748-.09-.12-0.738-.983-.738-1.873 0-.89.468-1.328.636-1.508.168-.18.366-.225.486-.225.12 0 .24.002.345.006.11.006.26-.041.408.312.152.366.52 1.267.565 1.359.045.092.075.2.015.32-.06.12-.09.195-.18.3-.09.105-.19.234-.27.315-.09.09-.185.187-.08.367.105.18.468.772 1.004 1.249.69.614 1.272.805 1.452.895.18.09.285.075.39-.045s.45-.525.57-.705.24-.15.405-.09c.165.06 1.05.495 1.23.585.18.09.3.135.345.21.045.075.045.435-.099.84z" />
                          </svg>
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Observações do Paciente */}
                {detalhe.observacao && (
                  <div className="mt-6 rounded-2xl bg-inset p-4 border border-default">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                      Observações / Queixa Principal
                    </span>
                    <p className="mt-1 text-xs text-secondary leading-relaxed italic">
                      &ldquo;{detalhe.observacao}&rdquo;
                    </p>
                  </div>
                )}
              </Card>

              {/* Card de Detalhes do Procedimento Agendado */}
              <Card variant="elevated">
                <h3 className="text-base font-bold text-primary border-b border-subtle pb-4">
                  Procedimento & Horário
                </h3>

                <div className="grid sm:grid-cols-3 gap-4 mt-5">
                  <div className="rounded-2xl bg-inset p-4 border border-default">
                    <span className="text-2xs font-bold uppercase tracking-wider text-accent">
                      Procedimento
                    </span>
                    <p className="text-base font-black text-primary mt-1">
                      {detalhe.procedimento?.titulo ?? 'Consulta Odontológica'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-inset p-4 border border-default">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                      Data & Horário
                    </span>
                    <p className="text-base font-black text-primary mt-1">
                      {formatarDataExibicao(detalhe.data)} às {detalhe.horario}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-inset p-4 border border-default">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                      Investimento Estimado
                    </span>
                    <p className="text-base font-black text-success mt-1">
                      {detalhe.procedimento?.preco
                        ? `R$ ${Number(detalhe.procedimento.preco).toFixed(2).replace('.', ',')}`
                        : 'Sob Avaliação'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Coluna 3: Histórico e Linha do Tempo de Auditoria */}
            <div className="lg:col-span-1">
              <Card variant="elevated">
                <div className="border-b border-subtle pb-4 mb-5">
                  <h3 className="text-base font-bold text-primary">Histórico de Auditoria</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Transições de status registradas no sistema.
                  </p>
                </div>

                {detalhe.historico.length === 0 ? (
                  <div className="py-12 text-center text-muted text-xs">
                    Nenhuma alteração de status registrada até o momento.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-border-subtle">
                    {detalhe.historico.map((item) => (
                      <div key={item.id} className="relative">
                        {/* Marcador centralizado sobre a linha vertical */}
                        <div className="absolute -left-[13px] top-4 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-surface bg-accent shadow-sm" />

                        <div className="rounded-2xl bg-inset p-3.5 border border-default">
                          <p className="text-xs font-bold text-primary">
                            {item.statusAnterior ? (
                              <span>
                                {item.statusAnterior} →{' '}
                                <strong className="text-accent">{item.statusNovo}</strong>
                              </span>
                            ) : (
                              <span>
                                Agendamento criado como{' '}
                                <strong className="text-accent">{item.statusNovo}</strong>
                              </span>
                            )}
                          </p>
                          <p className="text-2xs text-muted mt-1">
                            {new Date(item.alteradoEm).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
