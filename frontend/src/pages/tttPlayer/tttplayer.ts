import { joinGame, makeTurn, getSizeOfGame } from "./apiControllerPlayer.ts";
import { indexToPosition } from "@tttweb/shared";
import type { Page } from "../page.ts";
import "./tttPlayer.css";

const STORAGE_KEY = "tttPlayerSession";

type StoredSession = {
  gameId: string;
  playerToken: string;
  playerName: string;
  gameSize: number;
};

let refreshPage: (() => void) | null = null;

let gameId: string | null = null;
let playerToken: string | null = null;
let playerName: string | null = null;
let gameSize: number | null = null;

let errorMessage: string | null = null;
let successMessage: string | null = null;

// Gespeicherten Zustand laden (wird einmal beim Laden des Moduls ausgeführt)
function loadSession(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw) as Partial<StoredSession>;

    if (
      typeof data.gameId === "string" &&
      typeof data.playerToken === "string" &&
      typeof data.playerName === "string" &&
      typeof data.gameSize === "number" &&
      Number.isInteger(data.gameSize) &&
      data.gameSize > 0
    ) {
      gameId = data.gameId;
      playerToken = data.playerToken;
      playerName = data.playerName;
      gameSize = data.gameSize;
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Kaputte oder nicht lesbare Daten verwerfen
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* localStorage nicht verfügbar */
    }
  }
}

function saveSession(): void {
  if (!gameId || !playerToken || !playerName || !gameSize) return;

  const session: StoredSession = { gameId, playerToken, playerName, gameSize };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // z. B. privater Modus oder Speicher voll: App läuft trotzdem weiter
    console.warn("Session konnte nicht gespeichert werden.");
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage nicht verfügbar */
    console.warn("Session konnte nicht gelöscht werden.");
  }
}

function resetState(): void {
  gameId = null;
  playerToken = null;
  playerName = null;
  gameSize = null;
  clearSession();
}

loadSession();

// Wenn ein Zustand geladen wurde, muss er erst gegen den Server geprüft werden
let isCheckingSession = gameId !== null;
let sessionChecked = false;

// Prüft einmalig, ob das gespeicherte Spiel auf dem Server noch existiert
async function validateStoredSession(): Promise<void> {
  const storedGameId = gameId;
  if (sessionChecked || !storedGameId) return;

  sessionChecked = true;

  try {
    // Existiert das Spiel nicht mehr, wirft der Aufruf einen Fehler
    gameSize = await getSizeOfGame(storedGameId);
    saveSession();
  } catch {
    resetState();
    errorMessage =
      "Das gespeicherte Spiel existiert nicht mehr. Bitte tritt einem neuen Spiel bei.";
  } finally {
    isCheckingSession = false;
  }

  refreshPage?.();
}

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
      const token = await joinGame(enteredGameId, name);
      const size = await getSizeOfGame(enteredGameId);

      gameId = enteredGameId;
      playerToken = token;
      playerName = name;
      gameSize = size;

      saveSession();
      sessionChecked = true;

      successMessage = "Du bist dem Spiel beigetreten.";
    } catch (error) {
      resetState();

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

function bindLeaveButton(root: HTMLElement): void {
  const leaveButton = root.querySelector<HTMLButtonElement>(
    'button[data-action="leaveGame"]',
  );

  leaveButton?.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Möchtest du das Spiel wirklich verlassen? Dein gespeicherter Spielzustand geht dabei verloren.",
    );

    if (!confirmed) return;

    resetState();
    errorMessage = null;
    successMessage = null;
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
            isCheckingSession
              ? `<p class="ttt-player-hint" role="status">Gespeichertes Spiel wird geprüft…</p>`
              : !gameId
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

                    <button type="button" data-action="leaveGame">
                      Spiel verlassen
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
    bindLeaveButton(root);

    void validateStoredSession();
  },
};
