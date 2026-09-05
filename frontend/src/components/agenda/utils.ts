import type { AgendamentoAdmin } from '../../services/admin.service';

import type { DiaSemanaItem } from './AgendaWeeklyView';

export const HORARIOS_CLINICOS_MANHA = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
];

export const HORARIOS_CLINICOS_TARDE = [
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
];

export const TODOS_HORARIOS_SLOTS = [...HORARIOS_CLINICOS_MANHA, ...HORARIOS_CLINICOS_TARDE];

export function formatarParaIsoDate(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${String(ano)}-${mes}-${dia}`;
}

export function extrairDataYMD(dataIso: string): string {
  if (!dataIso) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) return dataIso;
  const partes = dataIso.split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(partes)) return partes;
  const d = new Date(dataIso);
  if (Number.isNaN(d.getTime())) return dataIso.slice(0, 10);
  const ano = d.getUTCFullYear();
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dia = String(d.getUTCDate()).padStart(2, '0');
  return `${String(ano)}-${mes}-${dia}`;
}

export function verificarSlotPassado(dataIso: string, horarioSlot: string): boolean {
  try {
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    const [hora, minuto] = horarioSlot.split(':').map(Number);
    const dataSlot = new Date(ano, mes - 1, dia, hora, minuto, 0);
    const agora = new Date();
    return dataSlot.getTime() < agora.getTime();
  } catch {
    return false;
  }
}

export function calcularDiasDaSemana(
  dataSelecionada: string,
  agendamentos: AgendamentoAdmin[],
): DiaSemanaItem[] {
  const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
  const dataObj = new Date(ano, mes - 1, dia);
  const diaDaSemana = dataObj.getDay();
  const diferencaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  const segundaFeira = new Date(dataObj);
  segundaFeira.setDate(dataObj.getDate() + diferencaSegunda);

  const dias: DiaSemanaItem[] = [];
  for (let i = 0; i < 7; i++) {
    const dataDia = new Date(segundaFeira);
    dataDia.setDate(segundaFeira.getDate() + i);
    const iso = formatarParaIsoDate(dataDia);
    const agendamentosNesteDia = agendamentos.filter((a) => extrairDataYMD(a.data) === iso);

    dias.push({
      dataIso: iso,
      dataObj: dataDia,
      nomeDia: dataDia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      diaMes: dataDia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      agendamentos: agendamentosNesteDia,
      isSelecionado: iso === dataSelecionada,
      isHoje: iso === formatarParaIsoDate(new Date()),
    });
  }
  return dias;
}
