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

  getWinner(winLength: number = this.size): WinnerInfo | null {
    if (
      !Number.isInteger(winLength) ||
      winLength < 2 ||
      winLength > this.size
    ) {
      throw new Error(
        `winLength must be an integer between 2 and ${this.size}.`,
      );
    }

    const EMPTY = 0;

    // Richtungen: rechts, runter, diagonal runter-rechts, diagonal runter-links
    const directions: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const player = this.getCell(row, column);
        if (player === EMPTY) continue;

        for (const [dRow, dColumn] of directions) {
          // Endpunkt der Reihe vorab prüfen, spart unnötige Schritte
          const endRow = row + dRow * (winLength - 1);
          const endColumn = column + dColumn * (winLength - 1);
          if (
            endRow < 0 ||
            endRow >= this.size ||
            endColumn < 0 ||
            endColumn >= this.size
          ) {
            continue;
          }

          const cells: Array<[number, number]> = [];
          for (let i = 0; i < winLength; i++) {
            const r = row + dRow * i;
            const c = column + dColumn * i;
            if (this.getCell(r, c) !== player) break;
            cells.push([r, c]);
          }

          if (cells.length === winLength) {
            return { winner: player, cells };
          }
        }
      }
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
