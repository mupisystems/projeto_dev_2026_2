import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { AdminLayout } from '../components/AdminLayout';
import { Alert } from '../components/ui/Alert';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { useContadorAnimado } from '../hooks/useContadorAnimado';
import { formatarDataExibicao, formatarTelefone } from '../schemas/agendamento.schema';
import { adminApi, type AgendamentoAdmin, type Procedimento } from '../services/admin.service';

export interface PacienteConsolidado {
  id: string; // Chave única (email normalizado)
  nome: string;
  email: string;
  telefone: string | null;
  totalConsultas: number;
  totalInvestido: number;
  procedimentosTitulos: string[];
  ultimoAgendamento: AgendamentoAdmin;
  agendamentos: AgendamentoAdmin[];
}

function normalizarTexto(texto: string): string {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function PatientsPage(): React.ReactNode {
  const toast = useToast();
  const [agendamentos, setAgendamentos] = useState<AgendamentoAdmin[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [recarregando, setRecarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros de busca
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'recorrentes'>('todos');

  // Modal de Histórico de Consultas do Paciente
  const [pacienteSelecionado, setPacienteSelecionado] = useState<PacienteConsolidado | null>(null);

  const carregarDados = useCallback(async (isRefresh = false): Promise<void> => {
    if (isRefresh) setRecarregando(true);
    else setCarregando(true);

    setErro(null);

    try {
      const [resAgendamentos, resProcedimentos] = await Promise.all([
        adminApi.listarAgendamentos({
          pagina: 1,
          limite: 100,
        }),
        adminApi.listarProcedimentos().catch(() => []),
      ]);

      setAgendamentos(resAgendamentos.agendamentos);
      setProcedimentos(resProcedimentos);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao carregar lista de pacientes.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  // Agrupamento de agendamentos em pacientes únicos
  const pacientesConsolidados = useMemo(() => {
    const mapa = new Map<string, PacienteConsolidado>();

    agendamentos.forEach((ag) => {
      const chave = ag.email.trim().toLowerCase();
      const proc = ag.procedimento || procedimentos.find((p) => p.id === ag.procedimentoId);
      const precoProc = proc?.preco ? Number(proc.preco) : 0;
      const tituloProc = proc?.titulo ?? 'Consulta Odontológica';

      const existente = mapa.get(chave);
      if (!existente) {
        mapa.set(chave, {
          id: chave,
          nome: ag.nome,
          email: ag.email,
          telefone: ag.telefone ?? null,
          totalConsultas: 1,
          totalInvestido: precoProc,
          procedimentosTitulos: [tituloProc],
          ultimoAgendamento: ag,
          agendamentos: [ag],
        });
      } else {
        existente.totalConsultas += 1;
        existente.totalInvestido += precoProc;
        if (!existente.procedimentosTitulos.includes(tituloProc)) {
          existente.procedimentosTitulos.push(tituloProc);
        }
        if (!existente.telefone && ag.telefone) {
          existente.telefone = ag.telefone;
        }
        // Atualiza para o agendamento mais recente
        if (new Date(ag.data) > new Date(existente.ultimoAgendamento.data)) {
          existente.ultimoAgendamento = ag;
          existente.nome = ag.nome; // Usa o nome mais atualizado
        }
        existente.agendamentos.push(ag);
      }
    });

    return Array.from(mapa.values());
  }, [agendamentos, procedimentos]);

  // Filtro de busca e tabs
  const pacientesFiltrados = useMemo(() => {
    let lista = pacientesConsolidados;

    const termo = busca.trim();
    if (termo) {
      const termoNorm = normalizarTexto(termo);
      const digitosBusca = termo.replace(/\D/g, '');

      lista = lista.filter((p) => {
        const nomeNorm = normalizarTexto(p.nome);
        const emailNorm = normalizarTexto(p.email);
        const bateNome = nomeNorm.includes(termoNorm);
        const bateEmail = emailNorm.includes(termoNorm);

        let bateTelefone = false;
        if (digitosBusca.length > 0 && p.telefone) {
          const digitosFone = p.telefone.replace(/\D/g, '');
          bateTelefone = digitosFone.includes(digitosBusca);
        }

        return bateNome || bateEmail || bateTelefone;
      });
    }

    if (filtroTipo === 'recorrentes') {
      lista = lista.filter((p) => p.totalConsultas >= 2);
    }

    return lista;
  }, [pacientesConsolidados, busca, filtroTipo]);

  // Métricas para os 4 KPIs
  const metricas = useMemo(() => {
    const totalPacientes = pacientesConsolidados.length;
    const somaConsultas = pacientesConsolidados.reduce((acc, p) => acc + p.totalConsultas, 0);
    const somaInvestimento = pacientesConsolidados.reduce((acc, p) => acc + p.totalInvestido, 0);
    const mediaNumero = totalPacientes > 0 ? somaConsultas / totalPacientes : 0;
    const ticketNumero = totalPacientes > 0 ? somaInvestimento / totalPacientes : 0;

    return {
      totalPacientes,
      somaInvestimento,
      mediaNumero,
      ticketNumero,
    };
  }, [pacientesConsolidados]);

  const animTotalPacientes = useContadorAnimado(metricas.totalPacientes, { duracaoMs: 1200 });
  const animSomaInvestimento = useContadorAnimado(metricas.somaInvestimento, {
    duracaoMs: 1400,
    decimais: 2,
  });
  const animMediaConsultas = useContadorAnimado(metricas.mediaNumero, {
    duracaoMs: 1000,
    decimais: 1,
  });
  const animTicketMedio = useContadorAnimado(metricas.ticketNumero, {
    duracaoMs: 1200,
    decimais: 2,
  });

  // Exportar pacientes para CSV
  const exportarPacientesCSV = (): void => {
    if (pacientesConsolidados.length === 0) return;

    const cabecalho = [
      'Nome',
      'Email',
      'Telefone',
      'Total Consultas',
      'Total Investido (R$)',
      'Última Consulta',
    ];
    const linhas = pacientesConsolidados.map((p) => [
      `"${p.nome.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.telefone ?? ''}"`,
      p.totalConsultas,
      p.totalInvestido.toFixed(2),
      formatarDataExibicao(p.ultimoAgendamento.data),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [cabecalho.join(','), ...linhas.map((l) => l.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `pacientes_sorriso_mineiro_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Lista de pacientes exportada com sucesso!');
  };

  const ICONE_ATUALIZAR = (
    <svg
      className={`h-4 w-4 ${recarregando ? 'animate-spin-reverse' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  const ICONE_EXPORTAR = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const ICONE_PACIENTES = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const ICONE_INVESTIMENTO = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ICONE_VISITAS = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const ICONE_TICKET = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );

  const KPI_CARDS = [
    {
      label: 'Pacientes Únicos',
      value: animTotalPacientes,
      desc: 'Clientes cadastrados',
      icone: ICONE_PACIENTES,
    },
    {
      label: 'Total em Serviços',
      value: `R$ ${animSomaInvestimento.toFixed(2).replace('.', ',')}`,
      desc: 'Investimento acumulado',
      icone: ICONE_INVESTIMENTO,
      destacado: true,
    },
    {
      label: 'Média de Visitas',
      value: animMediaConsultas.toFixed(1),
      desc: 'Consultas por paciente',
      icone: ICONE_VISITAS,
    },
    {
      label: 'Ticket Médio',
      value: `R$ ${animTicketMedio.toFixed(2).replace('.', ',')}`,
      desc: 'Valor médio por cliente',
      icone: ICONE_TICKET,
    },
  ];

  return (
    <AdminLayout
      titulo="Carteira de Pacientes"
      subtitulo="Gestão de pacientes cadastrados, histórico clínico acumulado e recall preventivo."
      acoes={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void carregarDados(true)}
            disabled={carregando || recarregando}
            title="Recarregar pacientes"
          >
            {ICONE_ATUALIZAR}
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={exportarPacientesCSV}
            title="Exportar dados para planilha CSV"
          >
            {ICONE_EXPORTAR}
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {erro && <Alert variant="error">{erro}</Alert>}

        {/* 4 Cards de Métricas Consolidadas dos Pacientes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {KPI_CARDS.map((kpi) => (
            <Card key={kpi.label} variant="elevated" className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  {kpi.icone}
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-primary tabular-nums">
                  {kpi.value}
                </span>
                <p className="text-2xs text-muted font-medium mt-0.5">{kpi.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lista e Tabela de Pacientes */}
        <Card variant="elevated" className="p-5 sm:p-6">
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-subtle">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={filtroTipo === 'todos' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setFiltroTipo('todos');
                }}
              >
                Todos ({pacientesConsolidados.length})
              </Button>
              <Button
                type="button"
                variant={filtroTipo === 'recorrentes' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setFiltroTipo('recorrentes');
                }}
              >
                Recorrentes (2+ consultas)
              </Button>
            </div>

            {/* Input de Busca */}
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                placeholder="Buscar por nome, e-mail ou telefone..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                }}
                className="pl-9 pr-9"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {busca && (
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBusca('');
                  }}
                  title="Limpar busca"
                  className="absolute right-2 top-2"
                >
                  ✕
                </IconButton>
              )}
            </div>
          </div>

          {/* Tabela de Pacientes */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-subtle">
            {carregando && pacientesConsolidados.length === 0 ? (
              <TableSkeleton rows={5} cols={7} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-subtle bg-inset font-bold uppercase tracking-wider text-muted">
                      <th className="px-5 py-3.5">Paciente</th>
                      <th className="px-4 py-3.5">Contato</th>
                      <th className="px-4 py-3.5 text-center">Consultas</th>
                      <th className="px-4 py-3.5">Investimento</th>
                      <th className="px-4 py-3.5">Procedimentos</th>
                      <th className="px-4 py-3.5">Última Visita</th>
                      <th className="px-5 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {pacientesFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-muted">
                          <EmptyState
                            icon={
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            }
                            title="Nenhum paciente encontrado"
                            description="Tente ajustar o filtro ou os termos de busca."
                          />
                        </td>
                      </tr>
                    ) : (
                      pacientesFiltrados.map((paciente) => {
                        const foneLimpo = paciente.telefone?.replace(/\D/g, '');

                        return (
                          <tr
                            key={paciente.id}
                            className="hover:bg-surface-hover/60 transition-colors"
                          >
                            {/* Nome + Avatar */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={paciente.nome} />
                                <div className="min-w-0">
                                  <span className="block font-bold text-primary truncate">
                                    {paciente.nome}
                                  </span>
                                  <span className="block text-2xs text-muted truncate">
                                    {paciente.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Telefone */}
                            <td className="px-4 py-4 text-secondary">
                              {paciente.telefone ? formatarTelefone(paciente.telefone) : '—'}
                            </td>

                            {/* Total Consultas */}
                            <td className="px-4 py-4 text-center">
                              <Badge variant="primary">{paciente.totalConsultas}x</Badge>
                            </td>

                            {/* Total Investido */}
                            <td className="px-4 py-4 font-bold text-success tabular-nums">
                              R$ {paciente.totalInvestido.toFixed(2).replace('.', ',')}
                            </td>

                            {/* Procedimentos Realizados */}
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[220px]">
                                {paciente.procedimentosTitulos.map((tit) => (
                                  <Badge
                                    key={tit}
                                    variant="neutral"
                                    className="truncate max-w-[140px]"
                                  >
                                    {tit}
                                  </Badge>
                                ))}
                              </div>
                            </td>

                            {/* Última Visita */}
                            <td className="px-4 py-4">
                              <span className="block text-primary font-medium">
                                {formatarDataExibicao(paciente.ultimoAgendamento.data)}
                              </span>
                              <span className="text-3xs text-muted">
                                às {paciente.ultimoAgendamento.horario}
                              </span>
                            </td>

                            {/* Ações */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botão Recall WhatsApp */}
                                {foneLimpo && (
                                  <a
                                    href={`https://wa.me/55${foneLimpo}?text=${encodeURIComponent(
                                      `Olá ${paciente.nome}, tudo bem? Aqui é da Clínica Odontológica Sorriso Mineiro! Gostaríamos de saber como você está e convidá-lo(a) para sua consulta preventiva de rotina. Vamos agendar seu horário?`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-button bg-success px-2.5 py-1.5 text-xs font-bold text-success-text hover:bg-emerald-500 hover:text-white transition-all"
                                    title="Enviar convite de retorno preventivo (Recall)"
                                  >
                                    <svg
                                      className="h-3.5 w-3.5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.128-.519-1.834-.757-3.018-2.627-3.11-2.748-.09-.12-0.738-.983-.738-1.873 0-.89.468-1.328.636-1.508.168-.18.366-.225.486-.225.12 0 .24.002.345.006.11.006.26-.041.408.312.152.366.52 1.267.565 1.359.045.092.075.2.015.32-.06.12-.09.195-.18.3-.09.105-.19.234-.27.315-.09.09-.185.187-.08.367.105.18.468.772 1.004 1.249.69.614 1.272.805 1.452.895.18.09.285.075.39-.045s.45-.525.57-.705.24-.15.405-.09c.165.06 1.05.495 1.23.585.18.09.3.135.345.21.045.075.045.435-.099.84z" />
                                    </svg>
                                    <span className="hidden sm:inline">Recall</span>
                                  </a>
                                )}

                                {/* Botão Ver Prontuário / Histórico */}
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setPacienteSelecionado(paciente);
                                  }}
                                >
                                  Histórico ({paciente.totalConsultas})
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Modal de Prontuário / Histórico do Paciente */}
        {pacienteSelecionado && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
            <Card
              variant="elevated"
              className="relative w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={pacienteSelecionado.nome} size="lg" />
                  <div>
                    <h3 className="text-lg font-black text-primary">{pacienteSelecionado.nome}</h3>
                    <p className="text-xs text-muted">
                      {pacienteSelecionado.email} • {pacienteSelecionado.telefone ?? 'Sem telefone'}
                    </p>
                  </div>
                </div>

                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPacienteSelecionado(null);
                  }}
                  aria-label="Fechar modal"
                >
                  ✕
                </IconButton>
              </div>

              {/* Resumo Rápido */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <Card variant="outlined" className="p-3.5">
                  <span className="text-3xs font-bold uppercase tracking-wider text-accent">
                    Total de Consultas
                  </span>
                  <p className="text-lg font-black text-primary mt-0.5">
                    {pacienteSelecionado.totalConsultas} atendimento(s)
                  </p>
                </Card>
                <Card variant="outlined" className="p-3.5">
                  <span className="text-3xs font-bold uppercase tracking-wider text-muted">
                    Investimento Acumulado
                  </span>
                  <p className="text-lg font-black text-success mt-0.5">
                    R$ {pacienteSelecionado.totalInvestido.toFixed(2).replace('.', ',')}
                  </p>
                </Card>
              </div>

              {/* Lista de Atendimentos do Paciente */}
              <h4 className="text-3xs font-bold uppercase tracking-wider text-muted mb-3">
                Histórico de Atendimentos
              </h4>
              <div className="space-y-2.5">
                {pacienteSelecionado.agendamentos.map((ag) => {
                  const proc =
                    ag.procedimento || procedimentos.find((p) => p.id === ag.procedimentoId);

                  return (
                    <div
                      key={ag.id}
                      className="flex items-center justify-between rounded-2xl border border-subtle bg-inset p-3.5"
                    >
                      <div>
                        <span className="font-bold text-primary block text-xs">
                          {proc?.titulo ?? 'Consulta Odontológica'}
                        </span>
                        <span className="text-2xs text-muted">
                          {formatarDataExibicao(ag.data)} às {ag.horario}
                        </span>
                        {ag.observacao && (
                          <p className="text-2xs text-secondary italic mt-1">
                            &ldquo;{ag.observacao}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            ag.status === 'CONFIRMADO'
                              ? 'success'
                              : ag.status === 'PENDENTE'
                                ? 'warning'
                                : ag.status === 'ATENDIDO'
                                  ? 'info'
                                  : 'danger'
                          }
                        >
                          {ag.status}
                        </Badge>
                        <Link
                          to={`/admin/agendamentos/${ag.id}`}
                          className="rounded-button border border-default bg-surface px-2.5 py-1 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all"
                        >
                          Ficha →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPacienteSelecionado(null);
                  }}
                >
                  Fechar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
