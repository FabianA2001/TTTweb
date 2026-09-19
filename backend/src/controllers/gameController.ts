import type { Request, Response, NextFunction } from "express";
import { gameToCompactGame as gameToCompactGame } from "@tttweb/shared";
import { gameRoomManager } from "../models/gameRoomManger.ts";
import { GameState } from "@tttweb/shared";
import { generateToken } from "../middlewares/authenticator.ts";

export function makeGameRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const { size } = req.body;
    const gameRoomId = gameRoomManager.createGameRoom(size);
    const gameRoom = gameRoomManager.getGameRoom(gameRoomId);
    if (!gameRoom) {
      throw new Error(
        "Game room not found, Server Error, you should not see this error",
      );
    }
    const creatorId = gameRoom.getCreatorId();
    const creatorToken = generateToken(creatorId!);

    res
      .status(201)
      .json({ gameRoomId: gameRoomId, creatorToken: creatorToken });
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
    const { gameRoomId } = req.params;
    if (!gameRoomId || typeof gameRoomId !== "string") {
      return res.status(400).json({ error: "Game room ID is required" });
    }
    const { playerName } = req.body;
    const gameRoom = gameRoomManager.getGameRoom(gameRoomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }

    if (gameRoom.getGame().getGameState() !== GameState.Preparation) {
      throw new Error("Cannot join a game that has already started");
    }

    const playerId = gameRoom.addPlayerToRoom(playerName);
    const playerToken = generateToken(playerId);
    res.status(200).json({ playerToken: playerToken });
  } catch (error) {
    next(error);
  }
}
export function startGameRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameRoomId } = req.params;
    if (!gameRoomId || typeof gameRoomId !== "string") {
      return res.status(400).json({ error: "Game room ID is required" });
    }
    const gameRoom = gameRoomManager.getGameRoom(gameRoomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    if (gameRoom.getGame().getGameState() !== GameState.Preparation) {
      throw new Error("can only start a game that is in preparation state");
    }
    gameRoom.startGame();

    res.status(200).json({ message: "Game started successfully" });
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
    const { gameRoomId } = req.params;
    if (!gameRoomId || typeof gameRoomId !== "string") {
      return res.status(400).json({ error: "Game room ID is required" });
    }
    const success = gameRoomManager.deleteRoom(gameRoomId);
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
    const { gameRoomId } = req.params;
    if (!gameRoomId || typeof gameRoomId !== "string") {
      return res.status(400).json({ error: "Game room ID is required" });
    }
    const gameRoom = gameRoomManager.getGameRoom(gameRoomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    if (!req.auth || !req.auth.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const playerId = req.auth.id;
    const { row, column } = req.body;

    gameRoom.gameTurn(row, column, playerId);
    res.status(200).json({ message: "Move made successfully" });
  } catch (error) {
    next(error);
  }
}

export function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameRoomId } = req.params;
    if (!gameRoomId || typeof gameRoomId !== "string") {
      return res.status(400).json({ error: "Game room ID is required" });
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
