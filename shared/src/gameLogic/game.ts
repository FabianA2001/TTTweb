import { Board, CellState } from "./board.ts";

export const GameState = {
  InProgress: 0,
  Draw: 1,
  CrossWins: 2,
  CircleWins: 3,
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export class Game {
  private readonly board: Board;
  private currentPlayer: CellState;
  private size: number;

  constructor(size: number) {
    this.board = new Board(size);
    this.currentPlayer = CellState.Cross;
    this.size = size;
  }

  getBoard(): Board {
    return this.board;
  }
  getSize(): number {
    return this.size;
  }

  getCurrentPlayer(): CellState {
    return this.currentPlayer;
  }

  gameturn(row: number, column: number): GameState {
    if (!this.makeMove(row, column)) {
      throw new Error("Cell is already occupied");
    }
    if (this.checkDraw()) {
      return GameState.Draw;
    }
    return this.checkWinnerAndMark();
  }

  makeMove(row: number, column: number): boolean {
    if (this.board.getCell(row, column) !== CellState.Empty) {
      return false; // Cell is already occupied
    }

    this.board.setCell(row, column, this.currentPlayer);
    this.switchPlayer();
    return true;
  }

  checkDraw(): boolean {
    return this.board.getBoard().every((cell) => cell !== CellState.Empty);
  }

  checkWinnerAndMark(): GameState {
    const winner = this.board.getWinner();

    for (let row = 0; row < this.board.getSize(); row++) {
      for (let column = 0; column < this.board.getSize(); column++) {
        this.board.setMark(row, column, false);
      }
    }
    if (!winner) {
      return GameState.InProgress;
    }
    for (const [row, column] of winner.cells) {
      this.board.setMark(row, column, true);
    }

    return winner.winner === CellState.Cross
      ? GameState.CrossWins
      : GameState.CircleWins;
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === CellState.Cross
        ? CellState.Circle
        : CellState.Cross;
  }
}
