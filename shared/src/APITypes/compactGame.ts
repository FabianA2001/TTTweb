import { Game, GameState } from "../gameLogic/game.ts";
import { Board } from "../gameLogic/board.ts";

export interface compactGame {
  // The size of the board (e.g., 3 for a 3x3 board)
  size: number;
  // A flat array representing the board state (0 for empty, 1 for player cross, 2 for player circle)
  board: Array<number>;
  // The current player represented as a number
  aktivePlayer: number;
  // Gamestatus (0 for in progress, 1 for draw, 2 for player cross wins, 3 for player circle wins)
  status: GameState;
}

export function compactGameToGame(compact: compactGame): Game {
  if (compact.board.length !== compact.size * compact.size) {
    throw new Error(
      `Expected array of length ${compact.size * compact.size}(${compact.size} * ${compact.size}), got ${compact.board.length}`,
    );
  }
  const board = new Board(compact.size);
  for (let i = 0; i < compact.board.length; i++) {
    const row = Math.floor(i / compact.size);
    const col = i % compact.size;
    board.setCell(row, col, compact.board[i]);
  }

  return new Game(compact.size, board, compact.aktivePlayer, compact.status);
}

export function gameToCompactGame(game: Game): compactGame {
  const size = game.getSize();
  const board: Array<number> = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      board.push(game.getBoard().getCell(row, col));
    }
  }
  return {
    size: size,
    board: board,
    aktivePlayer: game.getCurrentPlayer(),
    status: game.getGameState(),
  };
}
