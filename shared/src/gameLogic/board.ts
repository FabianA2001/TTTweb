export type WinnerInfo = {
  winner: number;
  cells: Array<[number, number]>;
};

export class Board {
  private readonly size: number;
  private readonly cells: number[];
  private readonly marks: boolean[];

  constructor(size: number, startValue: number = 0) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error("The board size must be a positive integer.");
    }

    this.size = size;
    this.cells = Array.from({ length: size * size }, () => startValue);
    this.marks = Array.from({ length: size * size }, () => false);
  }

  getSize(): number {
    return this.size;
  }

  getBoard(): number[] {
    return [...this.cells];
  }

  getWinner(): WinnerInfo | null {
    const size = this.size;
    const EMPTY = 0;

    const checkLine = (values: number[]): number | null => {
      const first = values[0];
      if (first === EMPTY) {
        return null;
      }
      return values.every((cell) => cell === first) ? first : null;
    };

    for (let row = 0; row < size; row++) {
      const winner = checkLine(this.getRow(row));
      if (winner !== null) {
        return {
          winner,
          cells: Array.from({ length: size }, (_, column) => [row, column]),
        };
      }
    }

    for (let column = 0; column < size; column++) {
      const winner = checkLine(this.getColumn(column));
      if (winner !== null) {
        return {
          winner,
          cells: Array.from({ length: size }, (_, row) => [row, column]),
        };
      }
    }

    const firstDiagonal = Array.from(
      { length: size },
      (_, index) => [index, index] as [number, number],
    );
    const secondDiagonal = Array.from(
      { length: size },
      (_, index) => [index, size - 1 - index] as [number, number],
    );

    const firstDiagonalWinner = checkLine(
      firstDiagonal.map(([row, column]) => this.getCell(row, column)),
    );
    if (firstDiagonalWinner !== null) {
      return { winner: firstDiagonalWinner, cells: firstDiagonal };
    }

    const secondDiagonalWinner = checkLine(
      secondDiagonal.map(([row, column]) => this.getCell(row, column)),
    );
    if (secondDiagonalWinner !== null) {
      return { winner: secondDiagonalWinner, cells: secondDiagonal };
    }

    return null;
  }

  getMarks(): boolean[] {
    return [...this.marks];
  }

  getCell(row: number, column: number): number {
    return this.cells[this.getIndex(row, column)];
  }

  setCell(row: number, column: number, value: number): void {
    this.cells[this.getIndex(row, column)] = value;
  }

  getRow(row: number): number[] {
    this.assertInRange(row, "row");

    const start = row * this.size;

    return this.cells.slice(start, start + this.size);
  }

  getColumn(column: number): number[] {
    this.assertInRange(column, "column");

    return Array.from(
      { length: this.size },
      (_, row) => this.cells[this.getIndex(row, column)],
    );
  }

  setBoard(values: number[]): void {
    if (values.length !== this.cells.length) {
      throw new Error(
        `The board expects ${this.cells.length} values, but received ${values.length}.`,
      );
    }

    this.cells.splice(0, this.cells.length, ...values);
    // Reset marks when the whole board is replaced
    this.marks.fill(false);
  }

  clear(): void {
    this.cells.fill(0);
    this.marks.fill(false);
  }

  private getIndex(row: number, column: number): number {
    this.assertInRange(row, "row");
    this.assertInRange(column, "column");

    return row * this.size + column;
  }

  isMarked(row: number, column: number): boolean {
    this.assertInRange(row, "row");
    this.assertInRange(column, "column");

    return this.marks[this.getIndex(row, column)];
  }

  setMark(row: number, column: number, value: boolean): void {
    this.assertInRange(row, "row");
    this.assertInRange(column, "column");

    this.marks[this.getIndex(row, column)] = Boolean(value);
  }

  toggleMark(row: number, column: number): void {
    this.assertInRange(row, "row");
    this.assertInRange(column, "column");

    const idx = this.getIndex(row, column);
    this.marks[idx] = !this.marks[idx];
  }

  private assertInRange(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 0 || value >= this.size) {
      throw new Error(`${name} must be between 0 and ${this.size - 1}.`);
    }
  }
}
