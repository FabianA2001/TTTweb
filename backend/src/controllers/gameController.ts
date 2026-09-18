import type { Request, Response, NextFunction } from "express";
import {
  gameToCompactGame as gameToCompactGame,
  getBestNextMove,
} from "@tttweb/shared";
import { gameStore } from "../models/GameStore.ts";
import type { Game } from "@tttweb/shared";

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

    const game: Game | undefined = gameStore.getGame(id);

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const player = Number(req.params.player);

    if (Number.isNaN(player)) {
      res.status(400).json({ error: "Invalid player (not a Number)" });
      return;
    }

    if (player > game.getNumberOfPlayers() || player < 1) {
      res.status(400).json({ error: "Invalid player (to big)" });
      return;
    }

    if (player !== game.getCurrentPlayer()) {
      res.status(409).json({ error: "Not your turn" });
      return;
    }

    const { row, col } = req.body as { row: number; col: number };

    try {
      game.gameturn(row, col);
    } catch (error) {
      res.status(400).json({ error: { error } });
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

    game.gameturn(nextMove[0], nextMove[1]);
    const compactGame = gameToCompactGame(game);
    res.json(compactGame);
  } catch (error) {
    next(error);
  }
};
