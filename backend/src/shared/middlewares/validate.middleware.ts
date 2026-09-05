import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodSchema } from 'zod';

// Middleware generico de validacao com Zod.
// Recebe um schema e valida o corpo da requisicao.
// Em caso de erro, retorna 400 com mensagens claras.

export function validarSchema(schema: ZodSchema): RequestHandler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const messages = result.error.errors.map((err) => err.message);
      response.status(400).json({ message: 'Dados invalidos', errors: messages });

      return;
    }

    request.body = result.data;
    next();
  };
}

// Middleware de validacao de query params com Zod.
// Usado em listagens que recebem pagina, limite, status e busca.

export function validarQuery(schema: ZodSchema): RequestHandler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      const messages = result.error.errors.map((err) => err.message);
      response.status(400).json({ message: 'Parametros invalidos', errors: messages });

      return;
    }

    request.query = result.data;
    next();
  };
}

// Middleware de validacao de parametros de rota com Zod.
// Usado quando o ID vem na URL.

export function validarParams(schema: ZodSchema): RequestHandler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      const messages = result.error.errors.map((err) => err.message);
      response.status(400).json({ message: 'Parametros de rota invalidos', errors: messages });

      return;
    }

    request.params = result.data;
    next();
  };
}
