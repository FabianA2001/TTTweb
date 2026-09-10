import { Game, GameState } from "./game.ts";

export class TwoPlayerGame extends Game {
  constructor(size: number) {
    super(size);
  }

  override gameturn(row: number, column: number): GameState {
    return super.gameturn(row, column);
  }
}
