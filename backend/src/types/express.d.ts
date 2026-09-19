import "express";

export interface TokenPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export {};
