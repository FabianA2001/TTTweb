import { IP, SERVER_PORT } from "@tttweb/shared";
export const API_BASE_URL = `http://${IP}:${SERVER_PORT}/api/ttt`;
export const GAME_ROOM_BASE_URL = `${API_BASE_URL}/gameRoom`;
export const WEBSOCKET_URL = `ws://${IP}/ws/game`;
