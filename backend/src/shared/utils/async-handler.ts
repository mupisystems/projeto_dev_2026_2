import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Wrapper para handlers async no Express 4.
// Garante que rejeicoes de Promise sejam encaminhadas ao errorHandler global.

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (request: Request, response: Response, next: NextFunction): void => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}
