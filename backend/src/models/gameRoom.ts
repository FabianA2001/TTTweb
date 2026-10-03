import type { Player } from "@tttweb/shared";
import { randomUUID } from "crypto";
import { gameStore } from "./GameStore.ts";
import type { Board } from "@tttweb/shared";
import { GameState } from "@tttweb/shared";
import type { Game } from "@tttweb/shared";
import { AppError } from "../middlewares/errorHandler.ts";

export type PlayerJoinedListener = (player: Player) => void;

export class GameRoom {
  private gameId: string;
  private players: Map<string, Player>;
  private currentSymbol: number = 1; // Start with symbol 1 for the first player
  private creatorId: string | null = null;
  private listeners = new Set<PlayerJoinedListener>();

  constructor(
    size?: number,
    board?: Board,
    currentPlayer?: number,
    numberOfPlayers?: number,
  ) {
    this.players = new Map<string, Player>();
    this.gameId = gameStore.createGame(
      size,
      board,
      currentPlayer,
      GameState.Preparation,
      numberOfPlayers,
    );
    this.creatorId = randomUUID(); // Generate a unique ID for the creator
  }

  subscribe(listener: PlayerJoinedListener): () => void {
    this.listeners.add(listener);

    // Funktion zum Abmelden zurückgeben
    return () => {
      this.listeners.delete(listener);
    };
  }

  getGameId(): string {
    return this.gameId;
  }

  getCreatorId(): string | null {
    return this.creatorId;
  }

  getGame(): Game {
    const game = gameStore.getGame(this.gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    return game;
  }

  getPlayers(): Map<string, Player> {
    return this.players;
  }

  startGame(): void {
    const game = gameStore.getGame(this.gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    game.setNumberOfPlayers(this.players.size);
    game.startGame();
  }

  gameTurn(row: number, column: number, playerId: string): void {
    const game = gameStore.getGame(this.gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    const player = this.players.get(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    if (game.getCurrentPlayer() !== player.symbol) {
      const err = new AppError("It's not this player's turn");
      err.status = 409;
      throw err;
    }

    game.gameturn(row, column);
  }

  addPlayerToRoom(playerName: string): string {
    let playerId: string;
    do {
      playerId = randomUUID();
    } while (this.players.has(playerId));

    const player: Player = {
      name: playerName,
      symbol: this.currentSymbol,
    };
    this.currentSymbol++; // Increment symbol for the next player
    this.players.set(playerId, player);

    // Notify all listeners about the new player
    for (const listener of this.listeners) {
      listener(player);
    }

    return playerId;
  }
}
