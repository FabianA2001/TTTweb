import type { compactGame, createGameRoomResponse } from "@tttweb/shared";
import { GAME_ROOM_BASE_URL } from "../../config";

const BASE_URL = GAME_ROOM_BASE_URL;

export async function createGame(): Promise<createGameRoomResponse> {
  const response = await fetch(BASE_URL + "/createGameRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      size: 3,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Failed to create game room: " + data.message);
  }

  const data = await response.json();
  return data;
}

export async function getGameState(id: string): Promise<compactGame> {
  const response = await fetch(`${BASE_URL}/getGame/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Failed to get game state: " + data.message);
  }

  const data = await response.json();
  return data as compactGame;
}

export async function startGame(
  id: string,
  creatorToken: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/startGameRoom/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creatorToken}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Failed to start game: " + data.message);
  }
}
