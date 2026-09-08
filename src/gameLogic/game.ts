import { Board, CellState } from "../gameLogic/board";

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

  makeMove(row: number, column: number): boolean {
    if (this.board.getCell(row, column) !== CellState.Empty) {
      return false; // Cell is already occupied
    }

    this.board.setCell(row, column, this.currentPlayer);
    this.switchPlayer();
    return true;
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === CellState.Cross
        ? CellState.Circle
        : CellState.Cross;
  }
}
