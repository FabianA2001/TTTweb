import { Board } from "./board.ts";
import { Game } from "./game.ts";

function isBoardFull(board: Board): boolean {
  return board.getBoard().every((cell) => cell !== 0);
}

function evaluateTerminal(
  board: Board,
  maximizingPlayer: number,
): number | null {
  const winner = board.getWinner()?.winner ?? null;

  if (winner === maximizingPlayer) {
    return 10;
  }
  if (winner && winner !== maximizingPlayer) {
    return -10;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  return null;
}

function minimax(
  board: Board,
  currentPlayer: number,
  maximizingPlayer: number,
  depth: number,
): number {
  const terminalScore = evaluateTerminal(board, maximizingPlayer);

  if (terminalScore !== null) {
    return terminalScore - depth;
  }

  const size = board.getSize();
  const nextPlayer = (currentPlayer % 2) + 1;
  const isMaximizing = currentPlayer === maximizingPlayer;
  let bestScore = isMaximizing
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board.getCell(row, column) !== 0) {
        continue;
      }

      board.setCell(row, column, currentPlayer);
      const score = minimax(board, nextPlayer, maximizingPlayer, depth + 1);
      board.setCell(row, column, 0);

      if (isMaximizing) {
        bestScore = Math.max(bestScore, score);
      } else {
        bestScore = Math.min(bestScore, score);
      }
    }
  }

  return bestScore;
}

function getBestMove(board: Board, player: number): [number, number] | null {
  if (evaluateTerminal(board, player) !== null) {
    return null;
  }

  const size = board.getSize();
  let bestRow: number | null = null;
  let bestColum: number | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const nextPlayer = (player % 2) + 1;

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board.getCell(row, column) !== 0) {
        continue;
      }

      board.setCell(row, column, player);
      const score = minimax(board, nextPlayer, player, 1);
      board.setCell(row, column, 0);

      if (score > bestScore) {
        bestScore = score;
        bestRow = row;
        bestColum = column;
      }
    }
  }

  if (bestRow === null || bestColum === null) {
    return null;
  }
  return [bestRow, bestColum];
}

export function getBestNextMove(game: Game): [number, number] | null {
  if (game.getNumberOfPlayers() !== 2) {
    return null;
  }
  return getBestMove(game.getBoard(), game.getCurrentPlayer());
}
