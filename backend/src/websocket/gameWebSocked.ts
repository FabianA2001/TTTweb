import { WebSocketServer } from "ws";
import type { Server } from "http";

import { gameWebSocketManager } from "./gameWebSocketManager.ts";

const PATH = "/ws/game";

export function setupGameWebSocket(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: PATH,
  });

  wss.on("connection", (socket) => {
    console.log("gameWebSocket client connected");

    let subscribedGameId: string | undefined;

    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "subscribe") {
          const gameId = message.gameId;

          subscribedGameId = gameId;

          gameWebSocketManager.subscribe(gameId, socket);

          console.log(`Client subscribed to game ${gameId}`);
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    });

    socket.on("close", () => {
      if (subscribedGameId) {
        gameWebSocketManager.unsubscribe(subscribedGameId, socket);
      }

      console.log("gameWebSocket client disconnected");
    });

    socket.on("error", (error) => {
      console.error("gameWebSocket error:", error);
    });
  });

  console.log("gameWebSocket server initialized");

  return wss;
}
