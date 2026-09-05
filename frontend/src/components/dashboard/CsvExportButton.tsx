import type { ReactNode } from 'react';

import { useToast } from '../../contexts/ToastContext';
import { formatarDataExibicao } from '../../schemas/agendamento.schema';
import type { AgendamentoAdmin } from '../../services/admin.service';
import { Button } from '../ui/Button';

interface CsvExportButtonProps {
  agendamentos: AgendamentoAdmin[];
}

export function CsvExportButton({ agendamentos }: CsvExportButtonProps): ReactNode {
  const toast = useToast();

  const exportarCSV = (): void => {
    if (agendamentos.length === 0) return;

    const cabecalho = [
      'ID',
      'Paciente',
      'Email',
      'Telefone',
      'Data',
      'Horario',
      'Procedimento',
      'Status',
    ];
    const linhas = agendamentos.map((item) => [
      item.id,
      `"${item.nome.replace(/"/g, '""')}"`,
      `"${item.email.replace(/"/g, '""')}"`,
      `"${item.telefone ?? ''}"`,
      formatarDataExibicao(item.data),
      item.horario,
      `"${item.procedimento?.titulo ?? 'Consulta'}"`,
      item.status,
    ]);

    const conteudo = [cabecalho.join(';'), ...linhas.map((l) => l.join(';'))].join('\n');
    const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `agendamentos_sorriso_mineiro_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Relatório CSV exportado com sucesso!');
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="gap-2"
      disabled={agendamentos.length === 0}
      onClick={exportarCSV}
      title="Exportar listagem atual para planilha CSV"
    >
      <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Exportar CSV
    </Button>
  );
}
