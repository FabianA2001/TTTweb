import { renderTicTacToeField } from "../components/tttField/tttField";
import { Game } from "../gameLogic/game";
import type { Page } from "./page.ts";

let refreshPage: (() => void) | null = null;
let isTicTacToeBound = false;
let game = new Game(3);

function cellIndexToRowAndColumn(cellIndex: number) {
  const size = game.getSize();
  const cellCount = size * size;

  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= cellCount) {
    return;
  }

  const row = Math.floor(cellIndex / size);
  const column = cellIndex % size;
  return [row, column];
}

function handleTicTacToeClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const cell = target.closest("[data-cell-index]");

  if (!(cell instanceof HTMLElement)) {
    return;
  }

  const cellIndex = Number(cell.dataset.cellIndex);

  if (!Number.isInteger(cellIndex)) {
    return;
  }
  const coords = cellIndexToRowAndColumn(cellIndex);
  if (!coords) return;
  const [row, column] = coords;
  game.makeMove(row, column);
  refreshPage?.();
}

export const ticTacToe: Page = {
  render: () => {
    return `
      <section>
        <h1>Tic Tac Toe</h1>
        <p>Klicke auf ein Feld, um den State zu ändern und die Seite neu zu rendern.</p>
        ${renderTicTacToeField(game.getBoard())}
      </section>
    `;
  },
  mount: ({ root, refresh }) => {
    refreshPage = refresh;

    if (isTicTacToeBound) {
      return;
    }

    isTicTacToeBound = true;
    root.addEventListener("click", handleTicTacToeClick);
  },
};
