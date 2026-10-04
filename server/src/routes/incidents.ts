import { Router } from "express";
import {
  listIncidents,
  shortlistResources,
  resolveIncidentHandler,
} from "../controllers/incidentController";
import { requireAuthority } from "../middlewares/auth";

const router = Router();

router.get("/", listIncidents);
router.get("/:id/shortlist", shortlistResources);
router.post("/:id/resolve", requireAuthority, resolveIncidentHandler);

export default router;
