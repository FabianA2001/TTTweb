import { Router } from "express";
import { getBestMove } from "../controllers/infoConstroller.ts";
import { authenticate, requireCreator } from "../middlewares/authenticator.ts";
import {
  makeGameRoom,
  addPlayerToGameRoom,
  startGameRoom,
  deleteGameRoom,
  gameTurn,
  getGame,
} from "../controllers/gameController.ts";

const router = Router();

router.post("/get-best-move", getBestMove);
router.post("/gameRoom/createGameRoom", makeGameRoom);
router.post("/gameRoom/addPlayerToGameRoom/:gameRoomId", addPlayerToGameRoom);
router.post(
  "/gameRoom/startGameRoom/:gameRoomId",
  authenticate,
  requireCreator,
  startGameRoom,
);
router.delete(
  "/gameRoom/deleteGameRoom/:gameRoomId",
  authenticate,
  requireCreator,
  deleteGameRoom,
);
router.post("/gameRoom/gameTurn/:gameRoomId", authenticate, gameTurn);
router.get("/gameRoom/getGame/:gameRoomId", getGame);

export default router;
