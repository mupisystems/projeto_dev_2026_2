import { useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';

import { AdminLayout } from '../components/AdminLayout';
import {
  AppointmentFilters,
  AppointmentPagination,
  AppointmentTable,
  CsvExportButton,
  DashboardBanner,
  DashboardKpiCards,
  DashboardRefreshButton,
} from '../components/dashboard';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import {
  adminApi,
  type AgendamentoAdmin,
  type Procedimento,
  type StatusAgendamento,
} from '../services/admin.service';

export function DashboardPage(): ReactNode {
  const toast = useToast();
  const [agendamentos, setAgendamentos] = useState<AgendamentoAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const [busca, setBusca] = useState('');
  const buscaDebounced = useDebounce(busca, 350);
  const [carregando, setCarregando] = useState(false);
  const [recarregando, setRecarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [contagensGlobais, setContagensGlobais] = useState({
    total: 0,
    pendentes: 0,
    confirmados: 0,
    atendidos: 0,
    cancelados: 0,
  });

  const carregarDados = useCallback(
    async (isRefresh = false): Promise<void> => {
      if (isRefresh) setRecarregando(true);
      else setCarregando(true);
      setErro(null);

      try {
        const [resAgendamentos, resContagens, resProcedimentos] = await Promise.all([
          adminApi.listarAgendamentos({
            pagina,
            limite,
            status: statusFiltro || undefined,
            busca: buscaDebounced || undefined,
          }),
          adminApi.contarAgendamentosPorStatus(),
          adminApi.listarProcedimentos().catch(() => []),
        ]);

        setAgendamentos(resAgendamentos.agendamentos);
        setTotal(resAgendamentos.total);
        setProcedimentos(resProcedimentos);
        setContagensGlobais(resContagens);
      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Erro ao carregar dados da dashboard.');
      } finally {
        setCarregando(false);
        setRecarregando(false);
      }
    },
    [pagina, statusFiltro, buscaDebounced, limite],
  );

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const handleStatusChange = async (id: string, novoStatus: StatusAgendamento): Promise<void> => {
    try {
      await adminApi.atualizarStatus(id, novoStatus);
      setAgendamentos((ant) => ant.map((a) => (a.id === id ? { ...a, status: novoStatus } : a)));
      toast.success(`Status atualizado para ${novoStatus}!`);
      void carregarDados(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao atualizar status.';
      setErro(msg);
      toast.error(msg);
    }
  };

  const metricas = useMemo(
    () => ({
      pendentes: contagensGlobais.pendentes,
      confirmados: contagensGlobais.confirmados,
      atendidos: contagensGlobais.atendidos,
      cancelados: contagensGlobais.cancelados,
      totalGeral: contagensGlobais.total,
      procedimentosAtivos: procedimentos.filter((p) => p.ativa).length,
    }),
    [contagensGlobais, procedimentos],
  );

  const totalPaginas = Math.ceil(total / limite);

  return (
    <AdminLayout
      titulo="Visão Geral & Atendimentos"
      subtitulo="Acompanhe os agendamentos, métricas clínicas e status dos pacientes em tempo real."
      acoes={
        <DashboardRefreshButton
          carregando={carregando}
          recarregando={recarregando}
          onRefresh={() => void carregarDados(true)}
        />
      }
    >
      <div className="space-y-6">
        {erro && (
          <Alert
            variant="error"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            {erro}
          </Alert>
        )}

        <DashboardBanner />

        <DashboardKpiCards
          metricas={metricas}
          recarregando={recarregando}
          statusFiltro={statusFiltro}
          onSelectStatus={(status) => {
            setStatusFiltro(status);
            setPagina(1);
          }}
        />

        <Card className="p-5 sm:p-6">
          <AppointmentFilters
            metricas={metricas}
            statusFiltro={statusFiltro}
            onSelectStatus={(id) => {
              setStatusFiltro(id);
              setPagina(1);
            }}
            busca={busca}
            onBuscaChange={(novaBusca) => {
              setBusca(novaBusca);
              setPagina(1);
            }}
            acoesDireita={<CsvExportButton agendamentos={agendamentos} />}
          />

          <div className="mt-6">
            <AppointmentTable
              agendamentos={agendamentos}
              carregando={carregando}
              temFiltro={Boolean(busca || statusFiltro)}
              onStatusChange={(id, status) => {
                void handleStatusChange(id, status);
              }}
            />

            <AppointmentPagination
              pagina={pagina}
              totalPaginas={totalPaginas}
              totalRegistros={total}
              carregando={carregando}
              onPaginaChange={(p) => {
                setPagina(p);
              }}
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
