import type { Request, Response, NextFunction } from "express";
import {
  boardToCompactBoard as gameToCompactGame,
  compactBoardToBoard,
  getBestNextMove,
} from "@tttweb/shared";
import type { Game, compactGame } from "@tttweb/shared";
import { GameStore, gameStore } from "../models/tttGame.ts";

export const getBestMove = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const compactGame = req.body as compactGame;
    const game: Game = compactBoardToBoard(compactGame);
    const nextMove = getBestNextMove(game);

    if (!nextMove) {
      res.json(gameToCompactGame(game));
      return;
    }

    game.makeMove(nextMove[0], nextMove[1]);
    const updatedCompactGame = gameToCompactGame(game);
    res.json(updatedCompactGame);
  } catch (error) {
    next(error);
  }
};

export const createGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = gameStore.createGame();
    res.json({ id });
  } catch (error) {
    next(error);
  }
};

export const getGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid game ID" });
      return;
    }

    const game = gameStore.getGame(id);

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const compactGame = gameToCompactGame(game);
    res.json(compactGame);
  } catch (error) {
    next(error);
  }
};

export const deleteGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(404).json({ error: "Invalid game ID" });
      return;
    }

    const deleted = gameStore.deleteGame(id);

    if (!deleted) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const makeMove = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(404).json({ error: "Invalid game ID" });
      return;
    }

    const game = gameStore.getGame(id);

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    //  (true for player cross, false for player circle)
    const player = req.params.player;
    if (player !== "1" && player !== "0") {
      res.status(400).json({ error: "Invalid player" });
      return;
    }
    if (
      (player === "1" && game.getCurrentPlayer() !== "Kreuz") ||
      (player === "0" && game.getCurrentPlayer() !== "Kreis")
    ) {
      res.status(409).json({ error: "Not your turn" });
      return;
    }

    const { row, col } = req.body as { row: number; col: number };

    if (!game.makeMove(row, col)) {
      res.status(400).json({ error: "Invalid move" });
      return;
    }

    const compactGame = gameToCompactGame(game);
    res.json(compactGame);
  } catch (error) {
    next(error);
  }
};

export const aiMakesMove = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      res.status(404).json({ error: "Invalid game ID" });
      return;
    }

    const game = gameStore.getGame(id);

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const nextMove = getBestNextMove(game);

    if (!nextMove) {
      res.status(400).json({ error: "No valid moves available" });
      return;
    }

    game.makeMove(nextMove[0], nextMove[1]);
    const compactGame = gameToCompactGame(game);
    res.json(compactGame);
  } catch (error) {
    next(error);
  }
};
