import { useState, useEffect, type SyntheticEvent, type ReactNode } from 'react';

import { agendamentoSchema, formatarTelefone } from '../schemas/agendamento.schema';
import type { AgendamentoFormData } from '../schemas/agendamento.schema';
import type { Procedimento } from '../services/api';

import {
  AppointmentFormField,
  CalendarPicker,
  ProcedureSelect,
  TimePicker,
} from './appointment-form';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';

interface AppointmentFormProps {
  procedimentos?: Procedimento[];
  onSubmit: (dados: AgendamentoFormData) => void;
  carregando?: boolean;
  procedimentoPreSelecionadoId?: string;
}

// Formulario publico de agendamento de consultas com subcomponentes modulares.
export function AppointmentForm({
  procedimentos = [],
  onSubmit,
  carregando = false,
  procedimentoPreSelecionadoId,
}: AppointmentFormProps): ReactNode {
  const [dados, setDados] = useState<AgendamentoFormData>({
    nome: '',
    email: '',
    telefone: '',
    procedimentoId: procedimentoPreSelecionadoId ?? '',
    data: '',
    horario: '',
    observacao: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  // Estados dos menus e pickers customizados
  const [procedimentoAberto, setProcedimentoAberto] = useState(false);
  const [dataAberta, setDataAberta] = useState(false);
  const [horarioAberto, setHorarioAberto] = useState(false);

  // Atualiza selecao ao receber pre-selecao externa
  useEffect(() => {
    if (procedimentoPreSelecionadoId) {
      setDados((prev) => ({ ...prev, procedimentoId: procedimentoPreSelecionadoId }));
    }
  }, [procedimentoPreSelecionadoId]);

  const handleChange = (campo: keyof AgendamentoFormData, valor: string): void => {
    let valorFormatado = valor;
    if (campo === 'telefone') {
      valorFormatado = formatarTelefone(valor);
    }

    setDados((prev) => ({ ...prev, [campo]: valorFormatado }));

    if (erros[campo]) {
      setErros((prev) => {
        const { [campo]: _removido, ...resto } = prev;
        return resto;
      });
    }
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const resultado = agendamentoSchema.safeParse(dados);
    if (!resultado.success) {
      const novosErros: Record<string, string> = {};
      for (const erro of resultado.error.issues) {
        const campo = erro.path[0];
        if (typeof campo === 'string' && !novosErros[campo]) {
          novosErros[campo] = erro.message;
        }
      }
      setErros(novosErros);
      return;
    }

    setErros({});
    onSubmit(resultado.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* 1. Selecao Personalizada do Procedimento */}
      <ProcedureSelect
        procedimentos={procedimentos}
        valor={dados.procedimentoId}
        onChange={(id) => {
          handleChange('procedimentoId', id);
        }}
        erro={erros.procedimentoId}
        desabilitado={carregando}
        aberto={procedimentoAberto}
        onToggle={(aberto) => {
          setProcedimentoAberto(aberto);
          if (aberto) {
            setDataAberta(false);
            setHorarioAberto(false);
          }
        }}
      />

      {/* 2. Dados Pessoais do Paciente (Nome, Email, Telefone) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AppointmentFormField
          id="nome"
          label="Nome Completo"
          obrigatorio
          erro={erros.nome}
          className="space-y-1.5 sm:col-span-2"
          icone={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        >
          <Input
            id="nome"
            type="text"
            placeholder="Ex: Maria Clara Silva"
            value={dados.nome}
            onChange={(e) => {
              handleChange('nome', e.target.value);
            }}
            disabled={carregando}
            error={Boolean(erros.nome)}
            className={erros.nome ? 'bg-danger/10' : ''}
          />
        </AppointmentFormField>

        <AppointmentFormField
          id="email"
          label="E-mail para Confirmação"
          obrigatorio
          erro={erros.email}
          icone={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        >
          <Input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={dados.email}
            onChange={(e) => {
              handleChange('email', e.target.value);
            }}
            disabled={carregando}
            error={Boolean(erros.email)}
            className={erros.email ? 'bg-danger/10' : ''}
          />
        </AppointmentFormField>

        <AppointmentFormField
          id="telefone"
          label="WhatsApp / Telefone"
          obrigatorio
          erro={erros.telefone}
          icone={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          }
        >
          <Input
            id="telefone"
            type="tel"
            placeholder="(38) 90000-0000"
            value={dados.telefone}
            onChange={(e) => {
              handleChange('telefone', e.target.value);
            }}
            disabled={carregando}
            maxLength={15}
            error={Boolean(erros.telefone)}
            className={erros.telefone ? 'bg-danger/10' : ''}
          />
        </AppointmentFormField>
      </div>

      {/* 3. Selecao de Data e Horario */}
      <div className="grid gap-4 sm:grid-cols-2">
        <CalendarPicker
          valor={dados.data}
          onChange={(dataIso) => {
            handleChange('data', dataIso);
          }}
          erro={erros.data}
          desabilitado={carregando}
          aberto={dataAberta}
          onToggle={(aberto) => {
            setDataAberta(aberto);
            if (aberto) {
              setProcedimentoAberto(false);
              setHorarioAberto(false);
            }
          }}
        />

        <TimePicker
          valor={dados.horario}
          onChange={(horario) => {
            handleChange('horario', horario);
          }}
          erro={erros.horario}
          desabilitado={carregando}
          aberto={horarioAberto}
          onToggle={(aberto) => {
            setHorarioAberto(aberto);
            if (aberto) {
              setProcedimentoAberto(false);
              setDataAberta(false);
            }
          }}
        />
      </div>

      {/* 4. Observacoes */}
      <AppointmentFormField
        id="observacao"
        label="Observações adicionais (Opcional)"
        erro={erros.observacao}
        icone={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        }
      >
        <Textarea
          id="observacao"
          rows={3}
          placeholder="Ex: Tenho sensibilidade dental; prefiro atendimento no período da manhã; etc."
          value={dados.observacao}
          onChange={(e) => {
            handleChange('observacao', e.target.value);
          }}
          disabled={carregando}
        />
      </AppointmentFormField>

      {/* 5. Botao de Envio & Reafirmacao de Seguranca */}
      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={carregando}
          disabled={carregando}
          className="w-full hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Solicitar Agendamento
        </Button>

        <p className="text-center text-xs text-muted flex items-center justify-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Seus dados estão seguros. Entraremos em contato para confirmar sua reserva.
        </p>
      </div>
    </form>
  );
}
