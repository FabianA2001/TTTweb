import { Router } from "express";
import { getBestMove } from "../controllers/infoConstroller.ts";

const router = Router();

router.post("/get-best-move", getBestMove);
//TODO add Routes

export default router;
