import "./tttField.css";
import { Board } from "../../../../shared/src/gameLogic/board";

function numberToSymbole(n: number): string {
  let result = "";

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return result;
}

export function renderTicTacToeField(
  board: Board,
  showFieldNumbers = false,
): string {
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
          const value = numberToSymbole(cell);
          const marked = board.isMarked(row, column);
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
