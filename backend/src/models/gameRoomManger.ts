import { gameStore } from "./GameStore.ts";
import { Game } from "@tttweb/shared";
import { GameRoom } from "./gameRoom.ts";
import type { Board } from "@tttweb/shared";
import { randomUUID } from "crypto";

class GameRoomManager {
  private gameRooms: Map<string, GameRoom> = new Map();

  createGameRoom(
    size?: number,
    board?: Board,
    currentPlayer?: number,
    numberOfPlayers?: number,
  ): string {
    let roomId: string;
    while (true) {
      roomId = randomUUID();
      if (!this.gameRooms.has(roomId)) {
        break;
      }
    }
    const gameRoom = new GameRoom(size, board, currentPlayer, numberOfPlayers);
    this.gameRooms.set(roomId, gameRoom);
    return roomId;
  }

  getGameRoom(roomId: string): GameRoom | undefined {
    return this.gameRooms.get(roomId);
  }

  deleteRoom(roomId: string): boolean {
    const gameRoom = this.gameRooms.get(roomId);
    if (!gameRoom) {
      return false;
    }
    gameStore.deleteGame(gameRoom.getGameId());
    return this.gameRooms.delete(roomId);
  }
}

export const gameRoomManager = new GameRoomManager();
