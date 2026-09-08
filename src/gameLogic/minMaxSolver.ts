import { Board, CellState } from "./board";
import { Game } from "./game";

type Move = {
  row: number;
  column: number;
};

function getWinner(board: Board): CellState | null {
  const size = board.getSize();

  for (let row = 0; row < size; row++) {
    const rowValues = board.getRow(row);
    if (rowValues.every((cell) => cell === CellState.Cross)) {
      return CellState.Cross;
    }
    if (rowValues.every((cell) => cell === CellState.Circle)) {
      return CellState.Circle;
    }
  }

  for (let column = 0; column < size; column++) {
    const columnValues = board.getColumn(column);
    if (columnValues.every((cell) => cell === CellState.Cross)) {
      return CellState.Cross;
    }
    if (columnValues.every((cell) => cell === CellState.Circle)) {
      return CellState.Circle;
    }
  }

  let diagonalOneCross = true;
  let diagonalOneCircle = true;
  let diagonalTwoCross = true;
  let diagonalTwoCircle = true;

  for (let index = 0; index < size; index++) {
    const firstDiagonalCell = board.getCell(index, index);
    const secondDiagonalCell = board.getCell(index, size - 1 - index);

    if (firstDiagonalCell !== CellState.Cross) {
      diagonalOneCross = false;
    }
    if (firstDiagonalCell !== CellState.Circle) {
      diagonalOneCircle = false;
    }
    if (secondDiagonalCell !== CellState.Cross) {
      diagonalTwoCross = false;
    }
    if (secondDiagonalCell !== CellState.Circle) {
      diagonalTwoCircle = false;
    }
  }

  if (diagonalOneCross || diagonalTwoCross) {
    return CellState.Cross;
  }
  if (diagonalOneCircle || diagonalTwoCircle) {
    return CellState.Circle;
  }

  return null;
}

function isBoardFull(board: Board): boolean {
  return board.getBoard().every((cell) => cell !== CellState.Empty);
}

function evaluateTerminal(
  board: Board,
  maximizingPlayer: CellState,
): number | null {
  const winner = getWinner(board);

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
