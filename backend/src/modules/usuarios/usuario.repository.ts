import type { Usuario } from '@prisma/client';

export type { Usuario };

/**
 * Estrutura de dados para criação de novos usuários no sistema.
 */
export type UsuarioData = Pick<Usuario, 'email' | 'nome' | 'senha' | 'admin'>;

/**
 * Contrato do repositório de usuários e operadores administrativos.
 * Permite alternar a fonte de autenticação sem modificar os serviços de domínio.
 */
export interface UsuarioRepository {
  /**
   * Busca um usuário cadastrado a partir de seu endereço de e-mail.
   * @param email E-mail cadastrado do usuário.
   * @returns O usuário encontrado ou nulo caso não exista.
   */
  buscarPorEmail(email: string): Promise<Usuario | null>;

  /**
   * Busca um usuário pelo seu identificador único.
   * @param id Identificador do usuário (UUID).
   * @returns O usuário correspondente ou nulo caso não exista.
   */
  buscarPorId(id: string): Promise<Usuario | null>;

  /**
   * Persiste um novo usuário com senha já hasheada no banco de dados.
   * @param dados Informações de cadastro do usuário.
   * @returns O usuário persistido.
   */
  criar(dados: UsuarioData): Promise<Usuario>;
}
