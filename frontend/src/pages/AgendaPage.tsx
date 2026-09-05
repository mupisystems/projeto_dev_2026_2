import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AdminLayout } from '../components/AdminLayout';
import {
  AgendaDailyGrid,
  AgendaHeader,
  AgendaKpiCards,
  AgendaWeeklyView,
  calcularDiasDaSemana,
  extrairDataYMD,
  formatarParaIsoDate,
} from '../components/agenda';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { useContadorAnimado } from '../hooks/useContadorAnimado';
import { cn } from '../lib/cn';
import {
  adminApi,
  type AgendamentoAdmin,
  type Procedimento,
  type StatusAgendamento,
} from '../services/admin.service';

export function AgendaPage(): ReactNode {
  const toast = useToast();
  const [agendamentos, setAgendamentos] = useState<AgendamentoAdmin[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [recarregando, setRecarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [dataSelecionada, setDataSelecionada] = useState<string>(() =>
    formatarParaIsoDate(new Date()),
  );
  const [modoVisualizacao, setModoVisualizacao] = useState<'dia' | 'semana'>('dia');
  const [filtroStatus, setFiltroStatus] = useState<string>('');

  const carregarDados = useCallback(async (isRefresh = false): Promise<void> => {
    if (isRefresh) setRecarregando(true);
    else setCarregando(true);
    setErro(null);

    try {
      const [resAgendamentos, resProcedimentos] = await Promise.all([
        adminApi.listarAgendamentos({ pagina: 1, limite: 100 }),
        adminApi.listarProcedimentos().catch(() => []),
      ]);

      setAgendamentos(resAgendamentos.agendamentos);
      setProcedimentos(resProcedimentos);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados da agenda.');
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const handleStatusChange = async (id: string, novoStatus: StatusAgendamento): Promise<void> => {
    try {
      await adminApi.atualizarStatus(id, novoStatus);
      setAgendamentos((ant) =>
        ant.map((ag) => (ag.id === id ? { ...ag, status: novoStatus } : ag)),
      );
      toast.success(`Status da consulta alterado para ${novoStatus}!`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao atualizar status.';
      setErro(msg);
      toast.error(msg);
    }
  };

  const mudarDia = (deltaDias: number): void => {
    const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    dataObj.setDate(dataObj.getDate() + deltaDias);
    setDataSelecionada(formatarParaIsoDate(dataObj));
  };

  const dataExtenso = useMemo(() => {
    const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
    const dataObj = new Date(ano, mes - 1, dia, 12, 0, 0);
    const textoFormatado = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dataObj);

    return {
      texto: textoFormatado.charAt(0).toUpperCase() + textoFormatado.slice(1),
      isHoje: dataSelecionada === formatarParaIsoDate(new Date()),
    };
  }, [dataSelecionada]);

  const todosAgendamentosDoDia = useMemo(
    () => agendamentos.filter((a) => extrairDataYMD(a.data) === dataSelecionada),
    [agendamentos, dataSelecionada],
  );

  const mapaHorarios = useMemo(() => {
    const mapa = new Map<string, AgendamentoAdmin[]>();
    todosAgendamentosDoDia.forEach((item) => {
      const lista = mapa.get(item.horario) || [];
      lista.push(item);
      mapa.set(item.horario, lista);
    });
    return mapa;
  }, [todosAgendamentosDoDia]);

  const metricasGerais = useMemo(
    () => ({
      totalGeral: agendamentos.length,
      pendentes: agendamentos.filter((a) => a.status === 'PENDENTE').length,
      confirmados: agendamentos.filter((a) => a.status === 'CONFIRMADO').length,
      atendidos: agendamentos.filter((a) => a.status === 'ATENDIDO').length,
    }),
    [agendamentos],
  );

  const animTotal = useContadorAnimado(metricasGerais.totalGeral, { duracaoMs: 1200 });
  const animPendentes = useContadorAnimado(metricasGerais.pendentes, { duracaoMs: 1000 });
  const animConfirmados = useContadorAnimado(metricasGerais.confirmados, { duracaoMs: 1000 });
  const animAtendidos = useContadorAnimado(metricasGerais.atendidos, { duracaoMs: 1000 });
  const animTotalDia = useContadorAnimado(todosAgendamentosDoDia.length, { duracaoMs: 800 });

  const diasDaSemana = useMemo(
    () => calcularDiasDaSemana(dataSelecionada, agendamentos),
    [dataSelecionada, agendamentos],
  );

  return (
    <AdminLayout
      titulo="Agenda Clínica"
      subtitulo="Visualização de grade horária diária e semanal com controle de slots e atendimentos."
      acoes={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void carregarDados(true)}
            disabled={carregando || recarregando}
            title="Recarregar agenda"
          >
            <svg
              className={cn('h-4 w-4', recarregando && 'animate-spin-reverse')}
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
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <Button asChild variant="primary" size="sm" className="gap-1.5">
            <Link to="/admin">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span className="hidden sm:inline">Visão Tabela</span>
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {erro && <Alert variant="error">{erro}</Alert>}

        <AgendaHeader
          dataSelecionada={dataSelecionada}
          onDataChange={setDataSelecionada}
          dataExtenso={dataExtenso}
          onMudarDia={mudarDia}
          onIrParaHoje={() => {
            setDataSelecionada(formatarParaIsoDate(new Date()));
          }}
          modoVisualizacao={modoVisualizacao}
          onModoChange={setModoVisualizacao}
          filtroStatus={filtroStatus}
          onFiltroStatusChange={setFiltroStatus}
        />

        <AgendaKpiCards
          animacoes={{
            total: animTotal,
            pendentes: animPendentes,
            confirmados: animConfirmados,
            atendidos: animAtendidos,
            totalDia: animTotalDia,
          }}
          temPendentes={metricasGerais.pendentes > 0}
          filtroStatus={filtroStatus}
          onSelectStatus={setFiltroStatus}
        />

        {modoVisualizacao === 'dia' && (
          <AgendaDailyGrid
            totalAtendimentos={animTotalDia}
            carregando={carregando}
            temAgendamentos={agendamentos.length > 0}
            dataSelecionada={dataSelecionada}
            mapaHorarios={mapaHorarios}
            procedimentos={procedimentos}
            filtroStatus={filtroStatus}
            onStatusChange={(id, status) => {
              void handleStatusChange(id, status);
            }}
          />
        )}

        {modoVisualizacao === 'semana' && (
          <AgendaWeeklyView
            diasDaSemana={diasDaSemana}
            onSelectDia={(dataIso) => {
              setDataSelecionada(dataIso);
              setModoVisualizacao('dia');
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
