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
