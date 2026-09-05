import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ToastProvider } from '../../contexts/ToastContext.js';
import type { AgendamentoAdmin } from '../../services/admin.service.js';

import { CsvExportButton } from './CsvExportButton.js';

describe('CsvExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/dummy-url');
    global.URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  const agendamentosMock: AgendamentoAdmin[] = [
    {
      id: 'agendamento-1',
      nome: 'Mariana "Silva" Santos',
      email: 'mariana.silva@email.com',
      telefone: '(31) 98765-4321',
      data: '2026-10-10',
      horario: '09:00',
      status: 'PENDENTE',
      observacao: 'Consulta de rotina',
      procedimentoId: 'proc-1',
      procedimento: {
        id: 'proc-1',
        titulo: 'Limpeza e Profilaxia',
        preco: '150.00',
        duracaoMinutos: 45,
        ativa: true,
      },
    },
    {
      id: 'agendamento-2',
      nome: 'Carlos Oliveira',
      email: 'carlos@email.com',
      telefone: null,
      data: '2026-10-11',
      horario: '14:30',
      status: 'CONFIRMADO',
      observacao: null,
      procedimentoId: 'proc-2',
      procedimento: {
        id: 'proc-2',
        titulo: 'Clareamento Dental',
        preco: '800.00',
        duracaoMinutos: 60,
        ativa: true,
      },
    },
  ];

  it('deve desabilitar o botão quando a lista de agendamentos estiver vazia', () => {
    render(
      <ToastProvider>
        <CsvExportButton agendamentos={[]} />
      </ToastProvider>,
    );

    const botao = screen.getByRole('button', { name: /exportar csv/i });
    expect(botao).toBeDisabled();
  });

  it('deve habilitar o botão quando houver agendamentos para exportar', () => {
    render(
      <ToastProvider>
        <CsvExportButton agendamentos={agendamentosMock} />
      </ToastProvider>,
    );

    const botao = screen.getByRole('button', { name: /exportar csv/i });
    expect(botao).not.toBeDisabled();
  });

  it('deve gerar e disparar o download do arquivo CSV com formatação correta ao clicar', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    render(
      <ToastProvider>
        <CsvExportButton agendamentos={agendamentosMock} />
      </ToastProvider>,
    );

    const botao = screen.getByRole('button', { name: /exportar csv/i });
    fireEvent.click(botao);

    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    const toastMensagem = screen.getByText('Relatório CSV exportado com sucesso!');
    expect(toastMensagem).toBeInTheDocument();
  });
});
