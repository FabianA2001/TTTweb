import "./tttMonitor.css";
import { renderTicTacToeField } from "../../components/tttField/tttField.ts";
import type { Page } from "../page.ts";
import { getMonitorState, mountMonitorPage } from "./apiControllerMointor";
import { MAX_GAME_SIZE, MIN_GAME_SIZE, DEFAULT_GAME_SIZE } from "./const.ts";
import { escapeHtml } from "@tttweb/shared";

const renderPlayers = (playerList: string | undefined): string => {
  const players = (playerList ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (players.length === 0) {
    return `<li class="monitor-page__player monitor-page__player--empty">Keine Teilnehmer</li>`;
  }

  return players
    .map((name) => `<li class="monitor-page__player">${escapeHtml(name)}</li>`)
    .join("");
};

let detachFit: (() => void) | null = null;

// Misst, wie viel Platz Navbar und Seitenrand über und unter der Seite belegen,
// und zieht das von der Bildschirmhöhe ab. So scrollt die Seite nie,
// auch wenn die Navbar auf dem Handy umbricht.
function fitToViewport(root: HTMLElement): void {
  detachFit?.();
  detachFit = null;

  const page = root.querySelector<HTMLElement>(".monitor-page");
  if (!page) return;

  const update = (): void => {
    const top = page.getBoundingClientRect().top + window.scrollY;
    const shell = page.closest<HTMLElement>(".page-shell");
    const bottom = shell
      ? Number.parseFloat(getComputedStyle(shell).paddingBottom) || 0
      : 0;

    page.style.setProperty(
      "--monitor-page-offset",
      `${Math.ceil(top + bottom)}px`,
    );
  };

  update();
  window.addEventListener("resize", update);
  detachFit = () => window.removeEventListener("resize", update);
}

export const tttMonitor: Page = {
  render: () => {
    const monitorState = getMonitorState();

    return `
    <section class="tic-tac-toe-page monitor-page">
      <div class="monitor-page__layout">
        <section class="monitor-page__panel monitor-page__panel--info" aria-label="Spielinformationen">
          <h2 class="monitor-page__panel-title">Spielinfos</h2>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Game ID</span>
            <strong class="monitor-page__value">${escapeHtml(monitorState.gameId ?? "–")}</strong>
          </div>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Game State</span>
            <span class="monitor-page__value">${escapeHtml(monitorState.currentGameState || "–")}</span>
          </div>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Aktiver Player</span>
            <span class="monitor-page__value">${escapeHtml(monitorState.activePlayerName || "–")}</span>
          </div>

          <div class="monitor-page__info">
            <label class="monitor-page__label" for="monitor-game-size">Boardgröße</label>
            <input
              id="monitor-game-size"
              class="monitor-page__input"
              type="number"
              min="${MIN_GAME_SIZE.toString()}"
              max="${MAX_GAME_SIZE.toString()}"
              step="1"
              value="${DEFAULT_GAME_SIZE.toString()}"
              inputmode="numeric"
              data-game-size
            />
          </div>

          <div class="game-mode-actions monitor-page__actions">
            <button type="button" data-game-mode="createGame">
              Game erstellen
            </button>

            ${
              monitorState.showStartButton
                ? `
                  <button type="button" data-game-action="startGame">
                    Spiel starten
                  </button>
                `
                : ""
            }
          </div>
        </section>

        <div class="monitor-page__board">${monitorState.board ? renderTicTacToeField(monitorState.board, monitorState.markedCells, true) : ""}</div>

        <section class="monitor-page__panel monitor-page__panel--players" aria-label="Spieler">
          <h2 class="monitor-page__panel-title">Aktive Player</h2>

          <ul class="monitor-page__players">
            ${renderPlayers(monitorState.playerList)}
          </ul>
        </section>
      </div>
    </section>
  `;
  },

  mount: ({ root, refresh }) => {
    fitToViewport(root);
    mountMonitorPage(root, refresh);
  },
};
