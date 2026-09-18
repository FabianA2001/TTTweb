import { gameStore } from "./GameStore.ts";
import { Game } from "@tttweb/shared";
import { randomUUID } from "crypto";
import { Player } from "./Player.ts";

interface GameRoom {
  gameId: string;
  players: Map<string, Player>; // playerId -> playerName
}

class GameRoomManager {
  private gameRooms: Map<string, GameRoom> = new Map();
  private currentSymbol: number = 1; // Start with symbol 1 for the first player

  createGameRoom(): string {
    let roomId: string;
    while (true) {
      roomId = randomUUID();
      if (!this.gameRooms.has(roomId)) {
        break;
      }
    }
    const gameId = gameStore.createGame();
    const gameRoom: GameRoom = {
      gameId,
      players: new Map(),
    };
    this.gameRooms.set(gameId, gameRoom);
    return roomId;
  }

  getGame(roomId: string): Game {
    const gameRoom = this.gameRooms.get(roomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    const game = gameStore.getGame(gameRoom.gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    return game;
  }

  deleteRoom(roomId: string): boolean {
    const gameRoom = this.gameRooms.get(roomId);
    if (!gameRoom) {
      return false;
    }
    gameStore.deleteGame(gameRoom.gameId);
    return this.gameRooms.delete(roomId);
  }

  addPlayerToRoom(roomId: string, playerName: string): string {
    const gameRoom = this.gameRooms.get(roomId);
    if (!gameRoom) {
      throw new Error("Game room not found");
    }
    let playerId: string;
    do {
      playerId = randomUUID();
    } while (gameRoom.players.has(playerId));

    const player: Player = {
      name: playerName,
      symbol: this.currentSymbol,
    };
    this.currentSymbol++; // Increment symbol for the next player
    gameRoom.players.set(playerId, player);
    return playerId;
  }
}

export const gameRoomManager = new GameRoomManager();
