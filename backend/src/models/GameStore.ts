import { Game } from "@tttweb/shared";
import { gameWebSocketManager } from "../websocket/gameWebSocketManager.ts";
import { gameToCompactGame } from "@tttweb/shared";
import type { Board, GameState } from "@tttweb/shared";

export class GameStore {
  private games = new Map<string, Game>();

  private addGameChangeListenerToGameWebSockedManger(
    gameId: string,
    game: Game,
  ) {
    game.subscribe((updatedGame) => {
      const compactGame = gameToCompactGame(updatedGame);
      gameWebSocketManager.broadcast(gameId, compactGame);
    });
  }

  createGame(
    size?: number,
    board?: Board,
    currentPlayer?: number,
    gameState?: GameState,
    numberOfPlayers?: number,
  ): string {
    const id = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const game = new Game(
      size,
      board,
      currentPlayer,
      gameState,
      numberOfPlayers,
    );

    this.games.set(id, game);
    this.addGameChangeListenerToGameWebSockedManger(id, game);
    return id;
  }

  getGame(id: string): Game | undefined {
    return this.games.get(id);
  }

  deleteGame(id: string): boolean {
    return this.games.delete(id);
  }
}

export const gameStore = new GameStore();
