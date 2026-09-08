import { Board, CellState } from "../gameLogic/board";

export enum GameState {
  InProgress,
  Draw,
  CrossWins,
  CircleWins,
}

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
    const size = this.board.getSize();

    // Clear previous marks
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        this.board.setMark(r, c, false);
      }
    }

    // Check rows
    for (let r = 0; r < size; r++) {
      const row = this.board.getRow(r);
      if (row.every((cell) => cell === CellState.Cross)) {
        for (let c = 0; c < size; c++) this.board.setMark(r, c, true);
        return GameState.CrossWins;
      }
      if (row.every((cell) => cell === CellState.Circle)) {
        for (let c = 0; c < size; c++) this.board.setMark(r, c, true);
        return GameState.CircleWins;
      }
    }

    // Check columns
    for (let c = 0; c < size; c++) {
      const col = this.board.getColumn(c);
      if (col.every((cell) => cell === CellState.Cross)) {
        for (let r = 0; r < size; r++) this.board.setMark(r, c, true);
        return GameState.CrossWins;
      }
      if (col.every((cell) => cell === CellState.Circle)) {
        for (let r = 0; r < size; r++) this.board.setMark(r, c, true);
        return GameState.CircleWins;
      }
    }

    // Check diagonals
    let diag1AllCross = true;
    let diag1AllCircle = true;
    let diag2AllCross = true;
    let diag2AllCircle = true;
    for (let i = 0; i < size; i++) {
      const d1 = this.board.getCell(i, i);
      const d2 = this.board.getCell(i, size - 1 - i);
      if (d1 !== CellState.Cross) diag1AllCross = false;
      if (d1 !== CellState.Circle) diag1AllCircle = false;
      if (d2 !== CellState.Cross) diag2AllCross = false;
      if (d2 !== CellState.Circle) diag2AllCircle = false;
    }
    if (diag1AllCross) {
      for (let i = 0; i < size; i++) this.board.setMark(i, i, true);
      return GameState.CrossWins;
    }
    if (diag1AllCircle) {
      for (let i = 0; i < size; i++) this.board.setMark(i, i, true);
      return GameState.CircleWins;
    }
    if (diag2AllCross) {
      for (let i = 0; i < size; i++) this.board.setMark(i, size - 1 - i, true);
      return GameState.CrossWins;
    }
    if (diag2AllCircle) {
      for (let i = 0; i < size; i++) this.board.setMark(i, size - 1 - i, true);
      return GameState.CircleWins;
    }

    return GameState.InProgress; // No winner yet
  }

  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === CellState.Cross
        ? CellState.Circle
        : CellState.Cross;
  }
}
