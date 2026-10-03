import type { WebSocket } from "ws";
import type { compactGame } from "@tttweb/shared";

// Hier definierst du deine möglichen WebSocket-Nachrichten.
// GameState entsprechend durch deinen tatsächlichen Typ ersetzen.
type GameState = compactGame;

type WebSocketMessages = {
  game_state: GameState;

  player_joined: {
    symbol: number;
    name: string;
  };
};

type WebSocketMessage<T> = {
  type: string;
  data: T;
};

class GameWebSocketManager {
  private clients = new Map<string, Set<WebSocket>>();

  subscribe(gameRoomId: string, socket: WebSocket) {
    let clients = this.clients.get(gameRoomId);

    if (!clients) {
      clients = new Set();
      this.clients.set(gameRoomId, clients);
    }

    clients.add(socket);

    console.log(`Socket subscribed to game Room ${gameRoomId}`);
  }

  unsubscribe(gameRoomId: string, socket: WebSocket) {
    const clients = this.clients.get(gameRoomId);

    if (!clients) {
      return;
    }

    clients.delete(socket);

    if (clients.size === 0) {
      this.clients.delete(gameRoomId);
    }
  }

  broadcast<K extends keyof WebSocketMessages>(
    gameRoomId: string,
    type: K,
    data: WebSocketMessages[K],
  ) {
    const clients = this.clients.get(gameRoomId);

    if (!clients) {
      return;
    }

    const message: WebSocketMessage<WebSocketMessages[K]> = {
      type,
      data,
    };

    const serializedMessage = JSON.stringify(message);

    for (const socket of clients) {
      if (socket.readyState === socket.OPEN) {
        socket.send(serializedMessage);
      }
    }
  }
}

export const gameWebSocketManager = new GameWebSocketManager();
