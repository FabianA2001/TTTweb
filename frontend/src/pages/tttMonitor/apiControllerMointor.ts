import { Game, compactGameToGame } from "@tttweb/shared";
import type { createGameRoomResponse } from "@tttweb/shared";

const BASE_URL = "http://localhost:3000/api/ttt";

export async function createGame(): Promise<createGameRoomResponse> {
  const response = await fetch(BASE_URL + "/gameRoom/createGameRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      size: 3,
    }),
  });

  const data = await response.json();
  return data;
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
  const response = await fetch(`${BASE_URL}/gameRoom/getGame/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Fehler beim Abrufen des Spielzustands: ${response.statusText}`,
    );
  }

  const data = await response.json();
  return compactGameToGame(data);
}

export async function startGame(
  id: string,
  creatorToken: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/gameRoom/startGameRoom/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creatorToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Starten des Spiels: ${response.statusText}`);
  }
}
