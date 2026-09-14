import { Game } from "@tttweb/shared";
import { gameWebSocketManager } from "../websocket/gameWebSocketManager.ts";
import { gameToCompactGame } from "@tttweb/shared";

export class GameStore {
  private games = new Map<string, Game>();
  private SIZE = 3;

  private addGameChangeListenerToGameWebSockedManger(
    gameId: string,
    game: Game,
  ) {
    game.subscribe((updatedGame) => {
      const compactGame = gameToCompactGame(updatedGame);
      gameWebSocketManager.broadcast(gameId, compactGame);
    });
  }

  createGame(): string {
    // const id = crypto.randomUUID();
    const id = "1"; //TODO delete
    const game = new Game(this.SIZE);

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
