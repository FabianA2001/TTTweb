import type { WebSocket } from "ws";

class GameWebSocketManager {
  private clients = new Map<string, Set<WebSocket>>();

  subscribe(gameId: string, socket: WebSocket) {
    let clients = this.clients.get(gameId);

    if (!clients) {
      clients = new Set();
      this.clients.set(gameId, clients);
    }

    clients.add(socket);

    console.log(`Socket subscribed to game ${gameId}`);
  }

  unsubscribe(gameId: string, socket: WebSocket) {
    const clients = this.clients.get(gameId);

    if (!clients) {
      return;
    }

    clients.delete(socket);

    if (clients.size === 0) {
      this.clients.delete(gameId);
    }
  }

  broadcast(gameId: string, message: unknown) {
    const clients = this.clients.get(gameId);

    if (!clients) {
      return;
    }

    const data = JSON.stringify(message);

    for (const socket of clients) {
      if (socket.readyState === socket.OPEN) {
        socket.send(data);
      }
    }
  }
}

export const gameWebSocketManager = new GameWebSocketManager();
