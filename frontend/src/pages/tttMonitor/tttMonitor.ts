import { renderTicTacToeField } from "../../components/tttField/tttField.ts";
import { compactGameToGame, Game } from "@tttweb/shared";
import type { Page } from "../page.ts";
import { createGame, subscribeToSocked } from "./apiController.ts";

let refreshPage: (() => void) | null = null;
let game: Game | null = null;
let gameId: string | null = null;
let mounted = false;
let socket: WebSocket | null = null;

function bindGameModeButtons(root: HTMLElement): void {
  const createGameButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="createGame"]',
  );
  createGameButton?.addEventListener("click", async () => {
    const id = await createGame();
    gameId = id;
    refreshPage?.();
    subscribeToSocked(id, socket);
  });
}

export const tttMonitor: Page = {
  render: () => {
    return `
      <section class="tic-tac-toe-page">
        <h1>Tic Tac Toe</h1>
        <h2>Game Id: ${gameId ? gameId : ""}</h2>
        <div class="game-mode-actions">
          <button type="button" data-game-mode="createGame">Create Game</button>
        </div>
        ${game ? renderTicTacToeField(game.getBoard()) : ""}
      </section>
    `;
  },
  mount: ({ root, refresh }) => {
    refreshPage = refresh;
    bindGameModeButtons(root);
    if (!mounted) {
      console.log("Mounting TTT Monitor page first Time");
      mounted = true;
      socket = new WebSocket("ws://localhost:3000/ws/game");
      socket.addEventListener("open", () => {
        console.log("Connected to gameWebSocket server");
      });
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        game = compactGameToGame(message);
        refreshPage?.();
      });
    }
  },
};
