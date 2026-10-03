import { renderTicTacToeField } from "../../components/tttField/tttField.ts";
import type { Page } from "../page.ts";
import { getMonitorState, mountMonitorPage } from "./apiControllerMointor";

export const tttMonitor: Page = {
  render: () => {
    const monitorState = getMonitorState();

    return `
      <section class="tic-tac-toe-page">
        <h1>Tic Tac Toe</h1>

        <h2>Game Id: ${monitorState.gameId ?? ""}</h2>

        <div class="game-mode-actions">
          <button
            type="button"
            data-game-mode="createGame"
          >
            Game erstellen
          </button>

          ${
            monitorState.showStartButton
              ? `
                <button
                  type="button"
                  data-game-action="startGame"
                >
                  Spiel starten
                </button>
              `
              : ""
          }
        </div>

        <div class="game-status-panel">
          <strong>Teilnehmer:</strong><br>
          ${monitorState.playerList}<br><br>

          <strong>Aktiver Spieler:</strong> ${monitorState.activePlayerName}<br>
          <strong>Game State:</strong> ${monitorState.currentGameState}
        </div>

        ${monitorState.board ? renderTicTacToeField(monitorState.board, [], true) : ""}
      </section>
    `;
  },

  mount: ({ root, refresh }) => {
    mountMonitorPage(root, refresh);
  },
};
