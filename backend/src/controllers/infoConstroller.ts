import type { Request, Response, NextFunction } from "express";
import {
  gameToCompactGame as gameToCompactGame,
  compactGameToGame,
  getBestNextMove,
} from "@tttweb/shared";
import type { Game, compactGame } from "@tttweb/shared";

export const getBestMove = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const compactGame = req.body as compactGame;
    const game: Game = compactGameToGame(compactGame);
    const nextMove = getBestNextMove(game);

    if (!nextMove) {
      res.json(gameToCompactGame(game));
      return;
    }

    game.gameturn(nextMove[0], nextMove[1]);
    const updatedCompactGame = gameToCompactGame(game);
    res.json(updatedCompactGame);
  } catch (error) {
    next(error);
  }
};
