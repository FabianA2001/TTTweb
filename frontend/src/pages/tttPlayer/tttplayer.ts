import { joinGame, makeTurn, getSizeOfGame } from "./apiControllerPlayer.ts";
import { indexToPosition } from "@tttweb/shared";
import type { Page } from "../page.ts";
import "./tttPlayer.css";

let refreshPage: (() => void) | null = null;

let gameId: string | null = null;
let playerToken: string | null = null;
let playerName: string | null = null;
let gameSize: number | null = null;

let errorMessage: string | null = null;
let successMessage: string | null = null;

// Schutz davor, dass Eingaben oder Fehlertexte als HTML interpretiert werden
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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
      playerName = name;
      gameSize = await getSizeOfGame(enteredGameId);

      successMessage = "Du bist dem Spiel beigetreten.";
    } catch (error) {
      gameId = null;
      playerToken = null;
      playerName = null;
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
      <section class="ttt-player-page">
        <header class="ttt-player-header">
          <h1>Tic Tac Toe</h1>
        </header>

        <div class="ttt-player-card">
          ${
            !gameId
              ? `
                <div class="ttt-player-form">
                  <h2>Spiel beitreten</h2>

                  <label class="ttt-player-field">
                    <span class="ttt-player-field-label">Game-ID</span>
                    <input
                      class="ttt-player-input"
                      type="text"
                      name="gameId"
                      placeholder="Game-ID eingeben"
                      autocomplete="off"
                    />
                  </label>

                  <label class="ttt-player-field">
                    <span class="ttt-player-field-label">Name</span>
                    <input
                      class="ttt-player-input"
                      type="text"
                      name="name"
                      placeholder="Name eingeben"
                      autocomplete="nickname"
                    />
                  </label>

                  <button type="button" data-game-mode="joinGame">
                    Spiel beitreten
                  </button>
                </div>
              `
              : `
                <div class="ttt-player-game-id">
                  <div class="ttt-player-game-id-row">
                    <span class="ttt-player-game-id-label">Spieler</span>
                    <span class="ttt-player-name-value">${escapeHtml(playerName ?? "")}</span>
                  </div>
                  <div class="ttt-player-game-id-row">
                    <span class="ttt-player-game-id-label">Game-ID</span>
                    <span class="ttt-player-game-id-value">${escapeHtml(gameId)}</span>
                  </div>
                </div>

                <div class="ttt-player-form">
                  <h2>Spielzug machen</h2>

                  <label class="ttt-player-field">
                    <span class="ttt-player-field-label">Feldnummer</span>
                    <input
                      class="ttt-player-input ttt-player-input--number"
                      type="number"
                      name="fieldNumber"
                      min="1"
                      max="${gameSize! * gameSize!}"
                      placeholder="1"
                      inputmode="numeric"
                    />
                  </label>

                  <p class="ttt-player-hint">Felder von 1 bis ${gameSize! * gameSize!}</p>

                  <button type="button" data-action="makeTurn">
                    Spielzug machen
                  </button>
                </div>
              `
          }

          ${
            successMessage
              ? `<p class="ttt-player-message ttt-player-message--success" role="status">${escapeHtml(successMessage)}</p>`
              : ""
          }

          ${
            errorMessage
              ? `<p class="ttt-player-message ttt-player-message--error" role="alert">${escapeHtml(errorMessage)}</p>`
              : ""
          }
        </div>
      </section>
    `;
  },

  mount: ({ root, refresh }) => {
    refreshPage = refresh;

    bindJoinGameButton(root);
    bindTurnButton(root);
  },
};
