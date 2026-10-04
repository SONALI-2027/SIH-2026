import { Router } from "express";
import { updateStatusHandler } from "../controllers/resourceController";
import { requireAuthority } from "../middlewares/auth";

const router = Router();

router.put("/:id/status", requireAuthority, updateStatusHandler);

export default router;
