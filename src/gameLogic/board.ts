export enum CellState {
  Empty = "leer",
  Cross = "Kreuz",
  Circle = "Kreis",
}

export class Board {
  private readonly size: number;
  private readonly cells: CellState[];
  private readonly marks: boolean[];

  constructor(size: number, startValue: CellState = CellState.Empty) {
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

  getBoard(): CellState[] {
    return [...this.cells];
  }

  getMarks(): boolean[] {
    return [...this.marks];
  }

  getCell(row: number, column: number): CellState {
    return this.cells[this.getIndex(row, column)];
  }

  setCell(row: number, column: number, value: CellState): void {
    this.cells[this.getIndex(row, column)] = value;
  }

  getRow(row: number): CellState[] {
    this.assertInRange(row, "row");

    const start = row * this.size;

    return this.cells.slice(start, start + this.size);
  }

  getColumn(column: number): CellState[] {
    this.assertInRange(column, "column");

    return Array.from(
      { length: this.size },
      (_, row) => this.cells[this.getIndex(row, column)],
    );
  }

  setBoard(values: CellState[]): void {
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
    this.cells.fill(CellState.Empty);
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
