import { renderTicTacToeField } from "../../components/tttField/tttField.ts";
import { GameState, OnePlayerGame, TwoPlayerGame } from "@tttweb/shared";
import type { Page } from "../page.ts";

let refreshPage: (() => void) | null = null;
let gameState: GameState = GameState.InProgress;
let isTicTacToeBound = false;
let game = new TwoPlayerGame(3);

const GameMode = {
  OnePlayer: "one-player",
  TwoPlayer: "two-player",
} as const;

type GameMode = (typeof GameMode)[keyof typeof GameMode];

function startGame(mode: GameMode): void {
  gameState = GameState.InProgress;
  game =
    mode === GameMode.OnePlayer ? new OnePlayerGame(3) : new TwoPlayerGame(3);
  refreshPage?.();
}

function handleOnePlayerButtonClick(): void {
  startGame(GameMode.OnePlayer);
}

function handleTwoPlayerButtonClick(): void {
  startGame(GameMode.TwoPlayer);
}

function bindGameModeButtons(root: HTMLElement): void {
  const onePlayerButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="one-player"]',
  );
  const twoPlayerButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="two-player"]',
  );

  onePlayerButton?.addEventListener("click", handleOnePlayerButtonClick);
  twoPlayerButton?.addEventListener("click", handleTwoPlayerButtonClick);
}

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
}

export const ticTacToe: Page = {
  render: () => {
    return `
      <section class="tic-tac-toe-page">
        <h1>Tic Tac Toe</h1>
        <div class="game-mode-actions">
          <button type="button" data-game-mode="one-player">1 Spieler</button>
          <button type="button" data-game-mode="two-player">2 Spieler</button>
        </div>
        <p>Klicke auf ein Feld, um den State zu ändern und die Seite neu zu rendern.</p>
        ${renderTicTacToeField(game.getBoard())}
      </section>
    `;
  },
  mount: ({ root, refresh }) => {
    console.log("Mounting Tic Tac Toe page");
    refreshPage = refresh;
    bindGameModeButtons(root);
    if (isTicTacToeBound) {
      return;
    }
    isTicTacToeBound = true;
    root.addEventListener("click", handleTicTacToeClick);
  },
};
