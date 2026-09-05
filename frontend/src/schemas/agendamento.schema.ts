import { z } from 'zod';

// Schemas de validação do formulário público de agendamento.
// Garante que os dados estejam no formato esperado antes do envio à API.

export const agendamentoSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Informe um e-mail válido').max(100, 'E-mail muito longo'),
  telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Informe um telefone válido com DDD e 9 dígitos')
    .optional()
    .or(z.literal('')),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida')
    .refine((valor) => {
      const [ano, mes, dia] = valor.split('-').map(Number);
      const dataSelecionada = new Date(ano, mes - 1, dia);
      const agora = new Date();
      const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      return !Number.isNaN(dataSelecionada.getTime()) && dataSelecionada >= hoje;
    }, 'A data deve ser hoje ou uma data futura'),
  horario: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, 'Informe um horário válido'),
  observacao: z.string().max(500, 'A observação deve ter no máximo 500 caracteres').optional(),
  procedimentoId: z.string().uuid('Selecione um procedimento'),
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

// Helpers para formatação e validação de campos do formulário.
export const formatarTelefone = (valor: string): string => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
};

export const gerarHorarios = (): string[] => {
  const horarios: string[] = [];

  for (let hora = 8; hora < 18; hora += 1) {
    for (const minuto of [0, 30]) {
      horarios.push(`${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`);
    }
  }

  return horarios;
};

export const formatarDataExibicao = (dataIso: string): string => {
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
