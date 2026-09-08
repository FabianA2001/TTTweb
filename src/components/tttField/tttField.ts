import "./tttField.css";
import { Board, CellState } from "../../gameLogic/board";

const symbolMap: Record<CellState, string> = {
  [CellState.Empty]: "",
  [CellState.Cross]: "X",
  [CellState.Circle]: "O",
};

export const renderTicTacToeField = (board: Board): string => {
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

          return `
            <button
              type="button"
              class="ttt-field__cell"
              data-cell-index="${index}"
              aria-label="Row ${row + 1}, Column ${column + 1}${value ? `, ${value}` : ", empty"}"
            >
              ${value}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
};
