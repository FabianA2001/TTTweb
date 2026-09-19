import type { Request, Response, NextFunction } from "express";
import { gameToCompactGame as gameToCompactGame } from "@tttweb/shared";
import { gameRoomManager } from "../models/gameRoomManger.ts";
import { GameState } from "@tttweb/shared";

export function makeGameRoome(req: Request, res: Response, next: NextFunction) {
  try {
    const { size } = req.body;
    const gameRoomId = gameRoomManager.createGameRoom(size);
    res.status(201).json({ gameId: gameRoomId });
  } catch (error) {
    next(error);
  }
}

export function addPlayerToGameRoom(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId, playerName } = req.body;
    const gameRoom = gameRoomManager.getGameRoom(gameId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }

    if (gameRoom.getGame().getGameState() !== GameState.Preparation) {
      throw new Error("Cannot join a game that has already started");
    }

    const playerId = gameRoom.addPlayerToRoom(gameId, playerName);
    res.status(200).json({ playerId });
  } catch (error) {
    next(error);
  }
}

export function deleteGameRoom(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId } = req.body;
    const success = gameRoomManager.deleteRoom(gameId);
    if (!success) {
      throw new Error("Game room not found");
    }
    res.status(200).json({ message: "Game room deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export function gameTurn(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, row, column, playerId } = req.body;
    const gameRoom = gameRoomManager.getGameRoom(gameId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    gameRoom.gameTurn(row, column, playerId);
    res.status(200).json({ message: "Move made successfully" });
  } catch (error) {
    next(error);
  }
}

export function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameRoomId } = req.params;
    if (!gameRoomId) {
      throw new Error("Game room ID is required");
    }
    if (typeof gameRoomId !== "string") {
      throw new Error("Game room ID must be a string");
    }
    const gameRoom = gameRoomManager.getGameRoom(gameRoomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    res.status(200).json(gameToCompactGame(gameRoom.getGame()));
  } catch (error) {
    next(error);
  }
}
