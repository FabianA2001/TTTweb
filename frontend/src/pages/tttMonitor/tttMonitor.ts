import "./tttMonitor.css";
import { renderTicTacToeField } from "../../components/tttField/tttField.ts";
import type { Page } from "../page.ts";
import { getMonitorState, mountMonitorPage } from "./apiControllerMointor";

const renderPlayers = (playerList: string | undefined): string => {
  const players = (playerList ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (players.length === 0) {
    return `<li class="monitor-page__player monitor-page__player--empty">Keine Teilnehmer</li>`;
  }

  return players
    .map((name) => `<li class="monitor-page__player">${name}</li>`)
    .join("");
};

export const tttMonitor: Page = {
  render: () => {
    const monitorState = getMonitorState();

    return `
    <section class="tic-tac-toe-page monitor-page">
      <div class="monitor-page__header">
        <h1>Tic Tac Toe</h1>
      </div>

      <div class="monitor-page__overview">
        <section class="monitor-page__panel" aria-label="Spielinformationen">
          <h2 class="monitor-page__panel-title">Spielinfos</h2>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Game ID</span>
            <strong>${monitorState.gameId ?? "–"}</strong>
          </div>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Game State</span>
            <span>${monitorState.currentGameState || "–"}</span>
          </div>

          <div class="monitor-page__info">
            <span class="monitor-page__label">Aktiver Player</span>
            <span>${monitorState.activePlayerName || "–"}</span>
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

        <section class="monitor-page__panel" aria-label="Spieler">
          <h2 class="monitor-page__panel-title">Aktive Player</h2>

          <ul class="monitor-page__players">
            ${renderPlayers(monitorState.playerList)}
          </ul>
        </section>
      </div>

      <div class="monitor-page__separator" aria-hidden="true"></div>

      <div class="monitor-page__board">
        ${monitorState.board ? renderTicTacToeField(monitorState.board, [], true) : ""}
      </div>
    </section>
  `;
  },

  mount: ({ root, refresh }) => {
    mountMonitorPage(root, refresh);
  },
};
