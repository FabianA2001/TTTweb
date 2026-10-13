import "./tttField.css";
import { indexToPosition } from "@tttweb/shared";
import { getPlayerColor } from "../../utils/playerColors.ts";

export function renderTicTacToeField(
  cells: number[],
  markedCells: boolean[] | null = [],
  showFieldNumbers = false,
  lastChangedCell: number | null = null,
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
          const hasValue = cell !== 0;
          const isLastChanged = lastChangedCell === index;
          const marked = (markedCells[index] ?? false) || isLastChanged;
          const fieldNumber = index + 1;

          return `
            <button
              type="button"
              class="ttt-field__cell${marked ? " ttt-field__cell--marked" : ""}${isLastChanged ? " ttt-field__cell--last-change" : ""}"
              data-cell-index="${index}"
              data-marked="${marked}"
              aria-label="Row ${row + 1}, Column ${column + 1}${hasValue ? `, player ${cell}` : ", empty"}${marked ? ", marked" : ""}${isLastChanged ? ", letzte Änderung" : ""}"
            >
              ${
                showFieldNumbers && !hasValue
                  ? `<span class="ttt-field__number">${fieldNumber}</span>`
                  : ""
              }
              ${
                hasValue
                  ? `<span class="ttt-field__token" style="--token-color: ${getPlayerColor(cell)};"></span>`
                  : ""
              }
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
  getLastChanged?: () => number | null;
}): {
  cells: number[];
  markedCells: boolean[];
  lastChangedCell: number | null;
} {
  return {
    cells: board.getBoard(),
    markedCells: board.getMarks(),
    lastChangedCell: board.getLastChanged ? board.getLastChanged() : null,
  };
}

export function renderTicTacToeFieldFromBoard(
  board: {
    getBoard: () => number[];
    getMarks: () => boolean[];
    getLastChanged?: () => number | null;
  },
  showFieldNumbers = false,
): string {
  const { cells, markedCells, lastChangedCell } = createBoardCellArray(board);
  return renderTicTacToeField(
    cells,
    markedCells,
    showFieldNumbers,
    lastChangedCell,
  );
}
