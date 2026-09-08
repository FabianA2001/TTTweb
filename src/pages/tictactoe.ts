import { renderTicTacToeField } from "../components/tttField/tttField";
import { Game, GameState } from "../gameLogic/game";
import type { Page } from "./page.ts";

let refreshPage: (() => void) | null = null;
let gameState: GameState = GameState.InProgress;
let isTicTacToeBound = false;
let game = new Game(3);

function mouseEventToRowAndColumn(
  event: MouseEvent,
): [number, number] | undefined {
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
  if (gameState !== GameState.InProgress) {
    alert("Das Spiel ist vorbei. Bitte starte ein neues Spiel.");
    return;
  }
  const coords = mouseEventToRowAndColumn(event);
  if (!coords) return;
  const [row, column] = coords;
  gameState = game.gameturn(row, column);
  refreshPage?.();
  if (gameState === GameState.Draw) {
    alert("Unentschieden!");
  }
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
    console.log("Mounting Tic Tac Toe page");
    refreshPage = refresh;
    if (isTicTacToeBound) {
      return;
    }
    isTicTacToeBound = true;
    root.addEventListener("click", handleTicTacToeClick);
  },
};
