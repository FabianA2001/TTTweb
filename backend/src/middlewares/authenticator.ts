import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import express from "express";

interface TokenPayload {
  playerId: string;
}

export function generateToken(playerId: string): string {
  return jwt.sign(
    { playerId } satisfies TokenPayload,
    config.JWT_SECRET,
    { expiresIn: "24h" }, // Standard: Tokens laufen ab
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch (err) {
    // Token ungültig, abgelaufen oder manipuliert
    return null;
  }
}

export function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Kein Token vorhanden" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Token ungültig oder abgelaufen" });
  }

  next();
}
