import type { compactGame, Player, GameState } from "@tttweb/shared";
import { numberToSymbole } from "@tttweb/shared";

type MonitorViewModel = {
  gameId: string | null;
  playerList: string;
  activePlayerName: string;
  currentGameState: string;
  showStartButton: boolean;
  board: number[] | null;
  markedCells: boolean[] | null;
};

let refreshPage: (() => void) | null = null;
let game: compactGame | null = null;
let gameId: string | null = null;
let creatorToken: string | null = null;
let players: Map<number, Player> = new Map();

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
}

export function getMonitorGame(): compactGame | null {
  return game;
}

export function setGameId(nextGameId: string | null): void {
  gameId = nextGameId;
}

export function getGameId(): string | null {
  return gameId;
}

export function setCreatorToken(nextCreatorToken: string | null): void {
  creatorToken = nextCreatorToken;
}

export function getCreatorToken(): string | null {
  return creatorToken;
}

export function clearMonitorPlayers(): void {
  players.clear();
}

export function addMonitorPlayer(player: Player): void {
  players.set(player.symbol, player);
}

export function setMonitorGameStatus(status: GameState): void {
  if (!game) {
    return;
  }
  game.status = status;
}

export function getMonitorState(): MonitorViewModel {
  const joinedPlayers = Array.from(players.values());
  const playerList =
    joinedPlayers.length > 0
      ? joinedPlayers
          .map(
            (player) => `• ${player.name} (${numberToSymbole(player.symbol)})`,
          )
          .join("<br>")
      : "Keine Spieler beigetreten";

  return {
    gameId,
    playerList,
    activePlayerName: game
      ? getPlayerNameBySymbol(game.aktivePlayer)
      : "Noch nicht festgelegt",
    currentGameState: game
      ? formatGameState(game.status)
      : "Noch kein Spiel geladen",
    showStartButton: Boolean(gameId && game?.status === 0),
    board: game?.board ?? null,
    markedCells: game?.markedCells ?? null,
  };
}
