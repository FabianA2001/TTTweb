import { Router } from "express";
import { createItem, getItems } from "../controllers/itemController.js";

const router = Router();

router.get("/", getItems);
router.post("/", createItem);

export default router;
