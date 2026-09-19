import { Board } from "./board.ts";

export const GameState = {
  Preparation: 0,
  InProgress: 1,
  Draw: 2,
  Winner: 3,
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export type GameChangeListener = (game: Game) => void;

export class Game {
  private readonly board: Board;
  private currentPlayer: number;
  private gameState: GameState;
  private size: number;
  private listeners = new Set<GameChangeListener>();
  private winner: number | null = null;
  private numberOfPlayers: number;

  constructor(
    size?: number,
    board?: Board,
    currentPlayer?: number,
    gameState?: GameState,
    numberOfPlayers?: number,
  ) {
    this.size = size ?? 3;
    this.board = board ?? new Board(size ?? 3);
    this.currentPlayer = currentPlayer ?? 1;
    this.gameState = gameState ?? GameState.InProgress;
    this.numberOfPlayers = numberOfPlayers ?? 2;
  }

  subscribe(listener: GameChangeListener): () => void {
    this.listeners.add(listener);

    // Funktion zum Abmelden zurückgeben
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyChange(): void {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  getBoard(): Board {
    return this.board;
  }
  getSize(): number {
    return this.size;
  }

  getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  getGameState(): GameState {
    return this.gameState;
  }
  getWinner(): number | null {
    return this.winner;
  }
  getNumberOfPlayers(): number {
    return this.numberOfPlayers;
  }

  setNumberOfPlayers(numberOfPlayers: number): void {
    if (this.gameState !== GameState.Preparation) {
      throw new Error(
        "Cannot change number of players after the game has started",
      );
    }
    this.numberOfPlayers = numberOfPlayers;
  }
  startGame(): void {
    if (this.gameState !== GameState.Preparation) {
      throw new Error("Game is already in progress or finished");
    }
    this.gameState = GameState.InProgress;
    this.notifyChange();
  }

  gameturn(row: number, column: number): GameState {
    if (this.gameState !== GameState.InProgress) {
      throw new Error("Game is not in progress");
    }
    if (!this.makeMove(row, column)) {
      throw new Error("Cell is already occupied");
    }
    if (this.checkDraw()) {
      this.gameState = GameState.Draw;
      return GameState.Draw;
    }
    this.gameState = this.checkWinnerAndMark();
    this.notifyChange();
    return this.gameState;
  }

  private makeMove(row: number, column: number): boolean {
    if (this.board.getCell(row, column) !== 0) {
      return false; // Cell is already occupied
    }

    this.board.setCell(row, column, this.currentPlayer);
    this.nextPlayer();
    return true;
  }

  private checkDraw(): boolean {
    return this.board.getBoard().every((cell) => cell !== 0);
  }

  private checkWinnerAndMark(): GameState {
    const winner = this.board.getWinner();

    for (let row = 0; row < this.board.getSize(); row++) {
      for (let column = 0; column < this.board.getSize(); column++) {
        this.board.setMark(row, column, false);
      }
    }
    if (!winner) {
      return GameState.InProgress;
    }
    for (const [row, column] of winner.cells) {
      this.board.setMark(row, column, true);
    }

    this.winner = winner.winner;
    return GameState.Winner;
  }

  private nextPlayer(): void {
    this.currentPlayer = (this.currentPlayer % this.numberOfPlayers) + 1;
  }
}
