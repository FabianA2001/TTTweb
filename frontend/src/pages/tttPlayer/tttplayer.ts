import { joinGame, makeTurn, getSizeOfGame } from "./apiControllerPlayer.ts";
import { indexToPosition } from "@tttweb/shared";
import type { Page } from "../page.ts";

let refreshPage: (() => void) | null = null;

let gameId: string | null = null;
let playerToken: string | null = null;
let gameSize: number | null = null;

let errorMessage: string | null = null;
let successMessage: string | null = null;

function bindJoinGameButton(root: HTMLElement): void {
  const joinGameButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="joinGame"]',
  );

  joinGameButton?.addEventListener("click", async () => {
    const gameIdInput = root.querySelector<HTMLInputElement>(
      'input[name="gameId"]',
    );

    const nameInput =
      root.querySelector<HTMLInputElement>('input[name="name"]');

    if (!gameIdInput || !gameIdInput.value.trim()) {
      errorMessage = "Bitte eine Game-ID eingeben.";
      refreshPage?.();
      return;
    }

    if (!nameInput || !nameInput.value.trim()) {
      errorMessage = "Bitte einen Namen eingeben.";
      refreshPage?.();
      return;
    }

    const enteredGameId = gameIdInput.value.trim();
    const name = nameInput.value.trim();

    errorMessage = null;
    successMessage = null;

    try {
      playerToken = await joinGame(enteredGameId, name);
      gameId = enteredGameId;
      gameSize = await getSizeOfGame(enteredGameId);

      successMessage = "Du bist dem Spiel beigetreten.";
    } catch (error) {
      gameId = null;
      playerToken = null;
      gameSize = null;

      errorMessage =
        error instanceof Error
          ? error.message
          : "Dem Spiel konnte nicht beigetreten werden.";
    }

    refreshPage?.();
  });
}

function bindTurnButton(root: HTMLElement): void {
  const turnButton = root.querySelector<HTMLButtonElement>(
    'button[data-action="makeTurn"]',
  );

  turnButton?.addEventListener("click", async () => {
    const input = root.querySelector<HTMLInputElement>(
      'input[name="fieldNumber"]',
    );

    if (!input || !input.value.trim()) {
      errorMessage = "Bitte eine Feldnummer eingeben.";
      refreshPage?.();
      return;
    }

    if (!gameId || !playerToken || !gameSize) {
      errorMessage = "Du bist keinem Spiel beigetreten.";
      refreshPage?.();
      return;
    }

    const fieldNumber = Number(input.value);

    if (!Number.isInteger(fieldNumber)) {
      errorMessage = "Bitte eine ganze Zahl eingeben.";
      refreshPage?.();
      return;
    }

    try {
      const [row, col] = indexToPosition(fieldNumber, gameSize);

      errorMessage = null;
      successMessage = null;

      await makeTurn(gameId, playerToken, row, col);

      successMessage = `Spielzug auf Feld ${fieldNumber} erfolgreich.`;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Der Spielzug konnte nicht ausgeführt werden.";
    }

    refreshPage?.();
  });
}

export const tttPlayer: Page = {
  render: () => {
    return `
      <section class="tic-tac-toe-page">
        <h1>Tic Tac Toe</h1>

        ${
          !gameId
            ? `
              <div class="game-mode-actions">
                <h2>Spiel beitreten</h2>

                <label>
                  Game-ID:
                  <input
                    type="text"
                    name="gameId"
                    placeholder="Game-ID eingeben"
                    style="width: 100%; max-width: 320px;"
                  />
                </label>

                <br />

                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    placeholder="Name eingeben"
                    style="width: 100%; max-width: 320px;"
                  />
                </label>

                <br />

                <button
                  type="button"
                  data-game-mode="joinGame"
                >
                  Spiel beitreten
                </button>
              </div>
            `
            : `
              <h2>Game Id: ${gameId}</h2>

              <div class="turn-actions">
                <h3>Spielzug machen</h3>

                <p>
                  Gib eine Feldnummer ein.
                  Das Spielfeld hat ${gameSize} × ${gameSize} Felder.
                </p>

                <label>
                  Feldnummer:
                  <input
                    type="number"
                    name="fieldNumber"
                    min="1"
                    max="${gameSize! * gameSize!}"
                    placeholder="Feldnummer"
                    style="width: 100%; max-width: 120px;"
                  />
                </label>

                <button
                  type="button"
                  data-action="makeTurn"
                >
                  Spielzug machen
                </button>
              </div>
            `
        }

        ${
          successMessage
            ? `<p class="success-message">${successMessage}</p>`
            : ""
        }

        ${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ""}
      </section>
    `;
  },

  mount: ({ root, refresh }) => {
    refreshPage = refresh;

    bindJoinGameButton(root);
    bindTurnButton(root);
  },
};
