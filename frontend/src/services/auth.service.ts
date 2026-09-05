import { api } from './api';

// Serviço de autenticação do painel administrativo.
// A autenticação é baseada em cookie httpOnly gerenciado pelo backend.

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  admin: boolean;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token?: string;
}

export const authService = {
  async login(dados: LoginInput): Promise<Usuario> {
    const response = await api.post<LoginResponse>('/auth/login', dados);
    return response.data.usuario;
  },

  async me(): Promise<Usuario> {
    const response = await api.get<{ usuario: Usuario }>('/auth/me');
    return response.data.usuario;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
