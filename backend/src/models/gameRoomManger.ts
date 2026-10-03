import { gameStore } from "./GameStore.ts";
import { Game } from "@tttweb/shared";
import { GameRoom } from "./gameRoom.ts";
import type { Board } from "@tttweb/shared";
import { gameWebSocketManager } from "../websocket/gameWebSocketManager.ts";
import { gameToCompactGame, generateNumberId } from "@tttweb/shared";

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
      roomId = generateNumberId(5);
      if (!this.gameRooms.has(roomId)) {
        break;
      }
    }
    const gameRoom = new GameRoom(size, board, currentPlayer, numberOfPlayers);
    this.gameRooms.set(roomId, gameRoom);
    this.addGameChangeListenerToGameWebSockedManger(roomId, gameRoom.getGame());
    return roomId;
  }
  private addGameChangeListenerToGameWebSockedManger(
    gameRoomId: string,
    game: Game,
  ) {
    game.subscribe((updatedGame) => {
      const compactGame = gameToCompactGame(updatedGame);
      gameWebSocketManager.broadcast(gameRoomId, compactGame);
    });
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
