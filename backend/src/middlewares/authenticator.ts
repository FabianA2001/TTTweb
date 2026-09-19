import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import express from "express";
import type { TokenPayload } from "../types/express.d.ts";
import { gameRoomManager } from "../models/gameRoomManger.ts";

export function generateToken(id: string): string {
  return jwt.sign(
    { id: id } satisfies TokenPayload,
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

  req.auth = { id: payload.id };

  next();
}

export function requireCreator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const { gameRoomId } = req.params;
  if (!gameRoomId || typeof gameRoomId !== "string") {
    return res.status(400).json({ error: "Game room ID is required" });
  }
  const gameRoom = gameRoomManager.getGameRoom(gameRoomId);

  if (!gameRoom) {
    return res.status(404).json({ error: "Game room not found" });
  }

  if (gameRoom.getCreatorId() !== req.auth!.id) {
    return res.status(403).json({ error: "Only the creator can do this" });
  }

  next();
}
