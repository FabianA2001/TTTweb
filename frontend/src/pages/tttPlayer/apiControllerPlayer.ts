import type { gameTurnRequest } from "@tttweb/shared";
import { GAME_ROOM_BASE_URL } from "../../config";

const BASE_URL = GAME_ROOM_BASE_URL;

export async function joinGame(
  gameRoomId: string,
  playerName: string,
): Promise<string> {
  const response = await fetch(
    BASE_URL + "/addPlayerToGameRoom/" + gameRoomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName: playerName }),
    },
  );

  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Failed to join game: " + data.message);
  }

  const data = await response.json();
  return data.playerToken;
}

export async function getSizeOfGame(gameRoomId: string): Promise<number> {
  const response = await fetch(BASE_URL + "/getGame/" + gameRoomId, {
    method: "GET",
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Failed to get game size: " + data.message);
  }

  const data = await response.json();
  return data.size;
}

export async function makeTurn(
  gameRoomId: string,
  playerToken: string,
  row: number,
  col: number,
): Promise<void> {
  const request: gameTurnRequest = {
    row,
    column: col,
  };

  const response = await fetch(BASE_URL + "/gameTurn/" + gameRoomId, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${playerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const data = await response.json();
    console.log(data.message);
    throw new Error("Fehler bei dem Spielzug: " + data.message);
  }
}
