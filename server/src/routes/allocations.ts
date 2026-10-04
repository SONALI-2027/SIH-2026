import { Router } from "express";
import { confirmAllocationHandler } from "../controllers/allocationController";
import { requireAuthority } from "../middlewares/auth";

const router = Router();

router.post("/confirm", requireAuthority, confirmAllocationHandler);

export default router;
