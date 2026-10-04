import { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import { confirmAllocation } from "../services/allocationService";

/**
 * POST /api/allocations/confirm — confirm a resource allocation.
 */
export async function confirmAllocationHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { report_id, resource_id } = req.body;
    const result = await confirmAllocation({ report_id, resource_id });

    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    // Emit Socket.IO event
    const io: SocketIOServer | undefined = req.app.get("io");
    if (io) {
      io.emit("allocation_confirmed", result);
    }

    res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error confirming allocation:", message);
    res.status(500).json({ error: message });
  }
}
