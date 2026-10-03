import type { WebSocket } from "ws";

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

  broadcast(gameRoomId: string, message: unknown) {
    const clients = this.clients.get(gameRoomId);

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
