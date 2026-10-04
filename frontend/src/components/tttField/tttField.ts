import "./tttField.css";
import { numberToSymbole, indexToPosition } from "@tttweb/shared";

export function renderTicTacToeField(
  cells: number[],
  markedCells: boolean[] | null = [],
  showFieldNumbers = false,
): string {
  if (markedCells === null) {
    markedCells = [];
  }
  if (markedCells.length !== 0 && markedCells.length !== cells.length) {
    throw new Error(
      `renderTicTacToeField: cells and markedCells must have the same length. Received ${cells.length} and ${markedCells.length}.`,
    );
  }

  const size = Math.sqrt(cells.length);
  if (!Number.isInteger(size) || size <= 0 || cells.length !== size * size) {
    throw new Error("renderTicTacToeField expects a square number array.");
  }

  return `
    <div class="ttt-field" role="grid" aria-label="TicTacToe board" style="--grid-size: ${size};">
      ${cells
        .map((cell, index) => {
          const [row, column] = indexToPosition(index + 1, size);
          const value = numberToSymbole(cell);
          const marked = markedCells[index] ?? false;
          const fieldNumber = index + 1;

          return `
            <button
              type="button"
              class="ttt-field__cell${marked ? " ttt-field__cell--marked" : ""}"
              data-cell-index="${index}"
              data-marked="${marked}"
              aria-label="Row ${row + 1}, Column ${column + 1}${value ? `, ${value}` : ", empty"}${marked ? ", marked" : ""}"
            >
              ${
                showFieldNumbers && !value
                  ? `<span class="ttt-field__number">${fieldNumber}</span>`
                  : ""
              }
              ${value}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

export function createBoardCellArray(board: {
  getBoard: () => number[];
  getMarks: () => boolean[];
}): { cells: number[]; markedCells: boolean[] } {
  return {
    cells: board.getBoard(),
    markedCells: board.getMarks(),
  };
}

export function renderTicTacToeFieldFromBoard(
  board: { getBoard: () => number[]; getMarks: () => boolean[] },
  showFieldNumbers = false,
): string {
  const { cells, markedCells } = createBoardCellArray(board);
  return renderTicTacToeField(cells, markedCells, showFieldNumbers);
}
