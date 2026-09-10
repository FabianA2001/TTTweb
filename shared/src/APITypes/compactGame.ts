import { Game } from "../gameLogic/game.ts";
import { Board } from "../gameLogic/board.ts";

export interface compactGame {
  // The size of the board (e.g., 3 for a 3x3 board)
  size: number;
  // A flat array representing the board state (0 for empty, 1 for player cross, 2 for player circle)
  board: Array<number>;
  // The current player represented as a boolean (true for player cross, false for player circle)
  aktivePlayer: boolean;
}

export function compactBoardToBoard(compact: compactGame): Game {
  if (compact.board.length !== compact.size * compact.size) {
    throw new Error(
      `Expected array of length ${compact.size * compact.size}(${compact.size} * ${compact.size}), got ${compact.board.length}`,
    );
  }
  const board = new Board(compact.size);
  for (let i = 0; i < compact.board.length; i++) {
    const row = Math.floor(i / compact.size);
    const col = i % compact.size;
    const cellValue = compact.board[i];
    if (cellValue === 1) {
      board.setCell(row, col, "Kreuz");
    } else if (cellValue === 2) {
      board.setCell(row, col, "Kreis");
    }
  }

  return new Game(
    compact.size,
    board,
    compact.aktivePlayer ? "Kreuz" : "Kreis",
  );
}

export function boardToCompactBoard(game: Game): compactGame {
  const size = game.getSize();
  const board: Array<number> = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cellValue = game.getBoard().getCell(row, col);
      if (cellValue === "Kreuz") {
        board.push(1);
      } else if (cellValue === "Kreis") {
        board.push(2);
      } else {
        board.push(0);
      }
    }
  }
  return {
    size: size,
    board: board,
    aktivePlayer: game.getCurrentPlayer() === "Kreuz",
  };
}
