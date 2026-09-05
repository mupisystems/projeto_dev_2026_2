import type { Agendamento, HistoricoStatus, StatusAgendamento } from '@prisma/client';

export type { Agendamento, HistoricoStatus, StatusAgendamento };

/**
 * Representa a contagem agregada de agendamentos por status operacional.
 */
export interface ContagemPorStatus {
  total: number;
  pendentes: number;
  confirmados: number;
  cancelados: number;
  atendidos: number;
}

/**
 * Agendamento completo acompanhado de seu histórico cronológico de transições de status.
 */
export type AgendamentoComHistorico = Agendamento & {
  historico: HistoricoStatus[];
};

/**
 * Dados necessários para a persistência de um novo agendamento de consulta.
 */
export type AgendamentoData = Pick<
  Agendamento,
  'nome' | 'email' | 'telefone' | 'data' | 'horario' | 'observacao' | 'procedimentoId'
>;

/**
 * Contrato do repositório de agendamentos.
 * Isola a camada de acesso a dados e persistência das regras de negócio do domínio.
 */
export interface AgendamentoRepository {
  /**
   * Lista agendamentos paginados com suporte a filtros por status e busca textual.
   * @param params Parâmetros de paginação e filtros de status e busca.
   * @returns Lista de agendamentos encontrados.
   */
  listar(params: {
    status?: StatusAgendamento;
    busca?: string;
    pagina: number;
    limite: number;
  }): Promise<Agendamento[]>;

  /**
   * Contabiliza o total de registros que satisfazem os critérios de filtro.
   * @param params Filtros aplicados de status e busca.
   * @returns Total de registros correspondentes.
   */
  contar(params: { status?: StatusAgendamento; busca?: string }): Promise<number>;

  /**
   * Retorna os totais agregados de consultas agrupados por cada status operacional.
   * @returns Objeto com contadores consolidados.
   */
  contarPorStatus(): Promise<ContagemPorStatus>;

  /**
   * Recupera um agendamento específico com o histórico completo de alterações.
   * @param id Identificador único do agendamento (UUID).
   * @returns O agendamento detalhado com histórico ou nulo se não encontrado.
   */
  buscarPorId(id: string): Promise<AgendamentoComHistorico | null>;

  /**
   * Verifica se já existe um agendamento ativo para o mesmo e-mail, data e horário.
   * @param email E-mail do paciente solicitante.
   * @param data Data da consulta.
   * @param horario Horário da consulta (formato HH:mm).
   * @returns Verdadeiro caso já exista conflito de agendamento.
   */
  existeAgendamento(email: string, data: Date, horario: string): Promise<boolean>;

  /**
   * Cria um novo registro de agendamento e gera o primeiro evento de histórico.
   * @param dados Dados validados do agendamento.
   * @returns O agendamento criado com status inicial PENDENTE.
   */
  criar(dados: AgendamentoData): Promise<Agendamento>;

  /**
   * Atualiza o status de um agendamento existente e registra a transição no histórico.
   * @param id Identificador único do agendamento.
   * @param status Novo status operacional a ser aplicado.
   * @param statusAnterior Status imediatamente anterior para registro de auditoria.
   * @returns O agendamento com o status atualizado.
   */
  atualizarStatus(
    id: string,
    status: StatusAgendamento,
    statusAnterior: StatusAgendamento,
  ): Promise<Agendamento>;
}
