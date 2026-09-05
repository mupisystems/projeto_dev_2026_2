import type { Procedimento } from '@prisma/client';

export type { Procedimento };

/**
 * Estrutura de dados para criação e atualização de procedimentos odontológicos.
 * Utiliza number para o preço mantendo a camada desacoplada do Decimal do ORM.
 */
export interface ProcedimentoData {
  titulo: string;
  ativa: boolean;
  preco: number | null;
  duracaoMinutos: number | null;
}

/**
 * Contrato do repositório de procedimentos odontológicos.
 * Isola a camada de persistência dos serviços de catálogo.
 */
export interface ProcedimentoRepository {
  /**
   * Lista todos os procedimentos atualmente ativos para exibição na página pública.
   * @returns Lista de procedimentos ativos.
   */
  listarAtivos(): Promise<Procedimento[]>;

  /**
   * Lista todos os procedimentos cadastrados (ativos e inativos) para o painel administrativo.
   * @returns Lista completa de procedimentos.
   */
  listarTodos(): Promise<Procedimento[]>;

  /**
   * Busca um procedimento específico pelo seu identificador único.
   * @param id Identificador único do procedimento (UUID).
   * @returns O procedimento encontrado ou nulo caso não exista.
   */
  buscarPorId(id: string): Promise<Procedimento | null>;

  /**
   * Cria um novo procedimento odontológico no banco de dados.
   * @param dados Dados do procedimento a ser cadastrado.
   * @returns O procedimento persistido.
   */
  criar(dados: ProcedimentoData): Promise<Procedimento>;

  /**
   * Atualiza parcialmente os dados ou o status de ativação de um procedimento.
   * @param id Identificador do procedimento a ser atualizado.
   * @param dados Dados a serem modificados.
   * @returns O procedimento atualizado.
   */
  atualizar(id: string, dados: Partial<ProcedimentoData>): Promise<Procedimento>;
}
