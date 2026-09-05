// Erro de dominio padrao do sistema.
// Mantido como alias de AppError para compatibilidade com testes existentes.
// @deprecated Prefira usar AppError com statusCode explicito.

import { AppError } from './app-error.js';

export class DomainError extends AppError {
  constructor(mensagem: string) {
    super(mensagem, 400);
    this.name = 'DomainError';
  }
}
