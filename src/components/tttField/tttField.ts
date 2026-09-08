import "./tttField.css";
import { Board, CellState } from "../../gameLogic/board";

const symbolMap: Record<CellState, string> = {
  [CellState.Empty]: "",
  [CellState.Cross]: "X",
  [CellState.Circle]: "O",
};

export function renderTicTacToeField(board: Board): string {
  if (!(board instanceof Board)) {
    throw new Error("renderTicTacToeField expects an instance of Board.");
  }

  const size = board.getSize();
  const cells = board.getBoard();

  return `
    <div class="ttt-field" role="grid" aria-label="TicTacToe board" style="--grid-size: ${size};">
      ${cells
        .map((cell, index) => {
          const row = Math.floor(index / size);
          const column = index % size;
          const value = symbolMap[cell];
          const marked = board.isMarked(row, column);

          return `
            <button
              type="button"
              class="ttt-field__cell${marked ? " ttt-field__cell--marked" : ""}"
              data-cell-index="${index}"
              data-marked="${marked}"
              aria-label="Row ${row + 1}, Column ${column + 1}${value ? `, ${value}` : ", empty"}${marked ? ", marked" : ""}"
            >
              ${value}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}
