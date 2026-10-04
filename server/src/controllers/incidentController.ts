import { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import {
  getAllIncidents,
  getShortlistForIncident,
  resolveIncident,
} from "../services/incidentService";

/**
 * GET /api/incidents — list all incidents.
 */
export async function listIncidents(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const incidents = await getAllIncidents();
    res.json(incidents);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error listing incidents:", message);
    res.status(500).json({ error: message });
  }
}

/**
 * GET /api/incidents/:id/shortlist — get top 3 compatible resources.
 */
export async function shortlistResources(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await getShortlistForIncident(id);

    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json(result.resources);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error getting shortlist:", message);
    res.status(500).json({ error: message });
  }
}

/**
 * POST /api/incidents/:id/resolve — resolve an in_progress incident.
 */
export async function resolveIncidentHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await resolveIncident(id);

    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    // Emit Socket.IO event
    const io: SocketIOServer | undefined = req.app.get("io");
    if (io) {
      io.emit("incident_resolved", result);
    }

    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error resolving incident:", message);
    res.status(500).json({ error: message });
  }
}
