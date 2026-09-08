import { Board, CellState } from "./board";
import { Game } from "./game";

type Move = {
  row: number;
  column: number;
};

function isBoardFull(board: Board): boolean {
  return board.getBoard().every((cell) => cell !== CellState.Empty);
}

function evaluateTerminal(
  board: Board,
  maximizingPlayer: CellState,
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
  currentPlayer: CellState,
  maximizingPlayer: CellState,
  depth: number,
): number {
  const terminalScore = evaluateTerminal(board, maximizingPlayer);

  if (terminalScore !== null) {
    return terminalScore - depth;
  }

  const size = board.getSize();
  const nextPlayer =
    currentPlayer === CellState.Cross ? CellState.Circle : CellState.Cross;
  const isMaximizing = currentPlayer === maximizingPlayer;
  let bestScore = isMaximizing
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board.getCell(row, column) !== CellState.Empty) {
        continue;
      }

      board.setCell(row, column, currentPlayer);
      const score = minimax(board, nextPlayer, maximizingPlayer, depth + 1);
      board.setCell(row, column, CellState.Empty);

      if (isMaximizing) {
        bestScore = Math.max(bestScore, score);
      } else {
        bestScore = Math.min(bestScore, score);
      }
    }
  }

  return bestScore;
}

function getBestMove(board: Board, player: CellState): Move | null {
  if (evaluateTerminal(board, player) !== null) {
    return null;
  }

  const size = board.getSize();
  let bestMove: Move | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const nextPlayer =
    player === CellState.Cross ? CellState.Circle : CellState.Cross;

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board.getCell(row, column) !== CellState.Empty) {
        continue;
      }

      board.setCell(row, column, player);
      const score = minimax(board, nextPlayer, player, 1);
      board.setCell(row, column, CellState.Empty);

      if (score > bestScore) {
        bestScore = score;
        bestMove = { row, column };
      }
    }
  }

  return bestMove;
}

export function getBestNextMove(game: Game): [number, number] | null {
  let bestmove = getBestMove(game.getBoard(), game.getCurrentPlayer());
  return bestmove ? [bestmove.row, bestmove.column] : null;
}
