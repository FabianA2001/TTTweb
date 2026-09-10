import { Router } from "express";
import { getNextMove } from "../controllers/tttController.ts";

const router = Router();

router.post("/next-move", getNextMove);

export default router;
