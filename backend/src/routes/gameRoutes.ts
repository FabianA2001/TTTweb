import { Router } from "express";
import {
  createGame,
  deleteGame,
  makeMove,
  getGame,
  aiMakesMove,
} from "../controllers/gameController.ts";
import { getBestMove } from "../controllers/infoConstroller.ts";

const router = Router();

router.post("/get-best-move", getBestMove);
router.post("/create-game", createGame);
router.get("/game/:id", getGame);
router.delete("/game/:id", deleteGame);
router.post("/game/:id/move/:player", makeMove);
router.post("/game/:id/ai-move", aiMakesMove);

export default router;
