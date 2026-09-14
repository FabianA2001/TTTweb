import { Game, compactGameToGame } from "@tttweb/shared";

const BASE_URL = "http://localhost:3000/api/ttt";

export async function createGame(): Promise<string> {
  const response = await fetch(BASE_URL + "/create-game", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Game konnte nicht erstellt werden");
  }

  const data = await response.json();
  return data.id;
}

export async function subscribeToSocked(id: string, socket: WebSocket | null) {
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

export async function getGameState(id: string): Promise<Game> {
  const response = await fetch(`${BASE_URL}/game/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Game state konnte nicht abgerufen werden");
  }

  const data = await response.json();
  return compactGameToGame(data);
}
