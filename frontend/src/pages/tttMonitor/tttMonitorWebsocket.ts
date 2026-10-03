import type { compactGame, Player } from "@tttweb/shared";
import { WEBSOCKET_URL } from "../../config";
import {
  addMonitorPlayer,
  getMonitorRefresh,
  setMonitorGame,
} from "./tttMonitorState";

let mounted = false;
let socket: WebSocket | null = null;

function handleSocketMessage(event: MessageEvent<string>): void {
  console.log("Received message from WebSocket:", event.data);
  const message = JSON.parse(event.data);
  const refreshPage = getMonitorRefresh();

  if (message.type === "game_state") {
    setMonitorGame(message.data as compactGame);
    refreshPage?.();
  }

  if (message.type === "player_joined") {
    const newPlayer: Player = {
      name: message.data.name,
      symbol: message.data.symbol,
    };
    addMonitorPlayer(newPlayer);
    console.log("New player joined:", newPlayer);
    refreshPage?.();
  }
}

export function mountMonitorWebSocket(): void {
  if (mounted) {
    return;
  }

  mounted = true;
  socket = new WebSocket(WEBSOCKET_URL);

  socket.addEventListener("open", () => {
    console.log("Connected to gameWebSocket server");
  });

  socket.addEventListener("message", handleSocketMessage);
}

export async function subscribeToSocket(id: string): Promise<void> {
  if (!socket) {
    throw new Error("WebSocket ist nicht verbunden");
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket ist noch nicht verbunden");
    return;
  }

  socket.send(
    JSON.stringify({
      type: "subscribe",
      gameId: id,
    }),
  );
}
