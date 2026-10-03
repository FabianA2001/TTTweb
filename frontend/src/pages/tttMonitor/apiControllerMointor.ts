import {
  clearMonitorPlayers,
  getCreatorToken,
  getGameId,
  getMonitorState as readMonitorState,
  setCreatorToken,
  setGameId,
  setMonitorGame,
  setMonitorGameStatus,
  monitorRefresh,
  setMonitorRefresh,
} from "./tttMonitorState";
import { createGame, getGameState, startGame } from "./tttMonitorApi";
import {
  mountMonitorWebSocket,
  subscribeToSocket,
} from "./tttMonitorWebsocket";

function bindGameModeButtons(root: HTMLElement): void {
  const createGameButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="createGame"]',
  );

  createGameButton?.addEventListener("click", async () => {
    const data = await createGame();

    setCreatorToken(data.creatorToken);
    setGameId(data.gameRoomId);
    clearMonitorPlayers();

    console.log("Game created with ID:", data.gameRoomId);

    if (data.gameRoomId) {
      setMonitorGame(await getGameState(data.gameRoomId));
      void subscribeToSocket(data.gameRoomId);
    }
    monitorRefresh();
  });

  const startGameButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-action="startGame"]',
  );

  startGameButton?.addEventListener("click", async () => {
    const currentGameId = getGameId();
    const creatorToken = getCreatorToken();

    if (!currentGameId || !creatorToken) {
      console.error("Game ID or creator token is missing");
      return;
    }

    try {
      await startGame(currentGameId, creatorToken);
      console.log("Game started");
      setMonitorGameStatus(1);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
    monitorRefresh();
  });
}

export function mountMonitorPage(root: HTMLElement, refresh: () => void): void {
  setMonitorRefresh(refresh);
  mountMonitorWebSocket();
  bindGameModeButtons(root);
}

export function getMonitorState() {
  return readMonitorState();
}
