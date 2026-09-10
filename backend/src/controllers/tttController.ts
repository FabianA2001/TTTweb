import type { Request, Response, NextFunction } from "express";
import {
  boardToCompactBoard,
  compactBoardToBoard,
  getBestNextMove,
} from "@tttweb/shared";
import type { Game, compactGame } from "@tttweb/shared";

export const getNextMove = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const compactGame = req.body as compactGame;
    const game: Game = compactBoardToBoard(compactGame);
    const nextMove = getBestNextMove(game);

    if (!nextMove) {
      res.json(boardToCompactBoard(game));
      return;
    }

    game.makeMove(nextMove[0], nextMove[1]);
    const updatedCompactGame = boardToCompactBoard(game);
    res.json(updatedCompactGame);
  } catch (error) {
    next(error);
  }
};
