import type { compactGame, Player, GameState } from "@tttweb/shared";
import { getPlayerColor } from "../../utils/playerColors.ts";

const MONITOR_STORAGE_KEY = "tttweb.monitorState";

type MonitorViewModel = {
  gameId: string | null;
  playerList: Array<{
    name: string;
    symbol: number;
    color: string;
  }>;
  activePlayerName: string;
  currentGameState: string;
  currentWinLength: number | null;
  showStartButton: boolean;
  board: number[] | null;
  markedCells: boolean[] | null;
};

let refreshPage: (() => void) | null = null;
let game: compactGame | null = null;
let gameId: string | null = null;
let creatorToken: string | null = null;
let players: Map<number, Player> = new Map();

type PersistedMonitorState = {
  game: compactGame | null;
  gameId: string | null;
  creatorToken: string | null;
  players: Player[];
};

function hasLocalStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readPersistedMonitorState(): PersistedMonitorState | null {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    const rawState = window.localStorage.getItem(MONITOR_STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsedState = JSON.parse(rawState) as Partial<PersistedMonitorState>;

    return {
      game:
        parsedState.game && typeof parsedState.game === "object"
          ? (parsedState.game as compactGame)
          : null,
      gameId:
        typeof parsedState.gameId === "string" ? parsedState.gameId : null,
      creatorToken:
        typeof parsedState.creatorToken === "string"
          ? parsedState.creatorToken
          : null,
      players: Array.isArray(parsedState.players)
        ? parsedState.players.filter((player): player is Player => {
            return (
              typeof player === "object" &&
              player !== null &&
              typeof player.name === "string" &&
              typeof player.symbol === "number"
            );
          })
        : [],
    };
  } catch {
    return null;
  }
}

function setPersistMonitorState(): void {
  if (!hasLocalStorage()) {
    return;
  }

  try {
    const state: PersistedMonitorState = {
      game,
      gameId,
      creatorToken,
      players: Array.from(players.values()),
    };

    window.localStorage.setItem(MONITOR_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures so the monitor keeps working without persistence.
  }
}

const persistedState = readPersistedMonitorState();

if (persistedState) {
  game = persistedState.game;
  gameId = persistedState.gameId;
  creatorToken = persistedState.creatorToken;
  players = new Map(
    persistedState.players.map((player) => [player.symbol, player]),
  );
}

function formatGameState(state: number): string {
  switch (state) {
    case 0:
      return "Vorbereitung";
    case 1:
      return "Läuft";
    case 2:
      return "Unentschieden";
    case 3:
      return "Gewonnen";
    default:
      return "Unbekannt";
  }
}

function getPlayerNameBySymbol(symbol: number): string {
  const player = players.get(symbol);
  return player ? player.name : `Spieler ${symbol}`;
}

export function setMonitorRefresh(refresh: (() => void) | null): void {
  refreshPage = refresh;
}

export function getMonitorRefresh(): (() => void) | null {
  return refreshPage;
}
export function monitorRefresh(): void {
  if (!refreshPage) {
    throw new Error("Refresh function is not set");
  }
  refreshPage();
}

export function setMonitorGame(nextGame: compactGame | null): void {
  game = nextGame;
  setPersistMonitorState();
}

export function getMonitorGame(): compactGame | null {
  return game;
}

export function setGameId(nextGameId: string | null): void {
  gameId = nextGameId;
  setPersistMonitorState();
}

export function getGameId(): string | null {
  return gameId;
}

export function setCreatorToken(nextCreatorToken: string | null): void {
  creatorToken = nextCreatorToken;
  setPersistMonitorState();
}

export function getCreatorToken(): string | null {
  return creatorToken;
}

export function clearMonitorPlayers(): void {
  players.clear();
  setPersistMonitorState();
}

export function addMonitorPlayer(player: Player): void {
  players.set(player.symbol, player);
  setPersistMonitorState();
}

export function setMonitorGameStatus(status: GameState): void {
  if (!game) {
    return;
  }
  game.status = status;
  setPersistMonitorState();
}

export function getMonitorState(): MonitorViewModel {
  const joinedPlayers = Array.from(players.values());
  const playerList = joinedPlayers.map((player) => ({
    name: player.name,
    symbol: player.symbol,
    color: getPlayerColor(player.symbol),
  }));

  return {
    gameId,
    playerList,
    activePlayerName: game
      ? getPlayerNameBySymbol(game.aktivePlayer)
      : "Noch nicht festgelegt",
    currentGameState: game
      ? formatGameState(game.status)
      : "Noch kein Spiel geladen",
    currentWinLength: game ? game.winLength : null,
    showStartButton: Boolean(gameId && game?.status === 0),
    board: game?.board ?? null,
    markedCells: game?.markedCells ?? null,
  };
}
