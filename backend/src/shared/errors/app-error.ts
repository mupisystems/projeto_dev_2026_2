// Erro de aplicacao padronizado com status HTTP.
// Permite que services lancem erros semanticos (401, 403, 404, 409, 400)
// que sao convertidos automaticamente pelo middleware global de erros.

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
