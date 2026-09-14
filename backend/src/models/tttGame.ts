import { Game } from "@tttweb/shared";


export class GameStore {
    private games = new Map<string, Game>();
    private SIZE = 3;

    createGame():  string {
    const id = crypto.randomUUID();
    const game = new Game(this.SIZE);

    this.games.set(id, game);
    
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