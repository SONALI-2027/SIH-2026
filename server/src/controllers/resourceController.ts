import { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import { updateResourceStatus } from "../services/resourceService";

/**
 * PUT /api/resources/:id/status — update a resource's status.
 */
export async function updateStatusHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Missing required field: status" });
      return;
    }

    const result = await updateResourceStatus(id, status);

    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    // Emit Socket.IO event
    const io: SocketIOServer | undefined = req.app.get("io");
    if (io) {
      io.emit("resource_status_updated", result.resource);
    }

    res.json(result.resource);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error updating resource status:", message);
    res.status(500).json({ error: message });
  }
}
