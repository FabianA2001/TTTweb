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

import { MAX_GAME_SIZE, MIN_GAME_SIZE } from "./const";

function getSelectedGameSize(root: HTMLElement): number {
  const sizeInput = root.querySelector<HTMLInputElement>("[data-game-size]");
  const parsedSize = Number.parseInt(
    sizeInput?.value ?? MIN_GAME_SIZE.toString(),
  );

  if (!Number.isInteger(parsedSize) || parsedSize < MIN_GAME_SIZE) {
    return MIN_GAME_SIZE;
  }

  return Math.min(parsedSize, MAX_GAME_SIZE);
}

function getSelectedWinLength(root: HTMLElement, gameSize: number): number {
  const winLengthInput =
    root.querySelector<HTMLInputElement>("[data-win-length]");
  const parsedWinLength = Number.parseInt(
    winLengthInput?.value ?? MIN_GAME_SIZE.toString(),
  );

  if (!Number.isInteger(parsedWinLength) || parsedWinLength < 2) {
    return 2;
  }

  return Math.min(parsedWinLength, gameSize);
}

async function currentGameExists(gameId: string): Promise<boolean> {
  try {
    await getGameState(gameId);
    return true;
  } catch {
    return false;
  }
}

function bindGameModeButtons(root: HTMLElement): void {
  const createGameButton = root.querySelector<HTMLButtonElement>(
    'button[data-game-mode="createGame"]',
  );

  createGameButton?.addEventListener("click", async () => {
    const currentGameId = getGameId();

    if (currentGameId && (await currentGameExists(currentGameId))) {
      if (
        !window.confirm(
          "Das aktuelle Spiel wird durch ein neues ersetzt. Fortfahren?",
        )
      ) {
        return;
      }
    }

    const size = getSelectedGameSize(root);
    const winLength = getSelectedWinLength(root, size);
    const data = await createGame(size, winLength);

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

  const currentGameId = getGameId();

  if (currentGameId) {
    void subscribeToSocket(currentGameId);
  }

  bindGameModeButtons(root);
}

export function getMonitorState() {
  return readMonitorState();
}
