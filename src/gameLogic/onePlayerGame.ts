import { getBestNextMove } from "./minMaxSolver";
import { Game, GameState } from "./game";

export class OnePlayerGame extends Game {
  constructor(size: number) {
    super(size);
  }

  override gameturn(row: number, column: number): GameState {
    const state = super.gameturn(row, column);

    if (state !== GameState.InProgress) {
      return state;
    }

    const bestMove = getBestNextMove(this);

    if (!bestMove) {
      return GameState.Draw;
    }

    return super.gameturn(bestMove[0], bestMove[1]);
  }
}
