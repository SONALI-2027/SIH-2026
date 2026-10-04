import pool from "../db";

// ── Constants ──────────────────────────────────

const VALID_STATUSES = ["en_route", "at_scene", "available"] as const;
type ResourceStatusValue = (typeof VALID_STATUSES)[number];

// Valid state transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  available: ["en_route"],
  en_route: ["at_scene"],
  at_scene: ["available"],
};

// ── Interfaces ─────────────────────────────────

export interface UpdatedResource {
  id: string;
  name: string;
  type: string;
  capacity_total: number;
  capacity_used: number;
  status: string;
  disaster_types: string[];
  created_at: Date;
}

// ── Service Functions ──────────────────────────

/**
 * Update a resource's status with transition validation.
 */
export async function updateResourceStatus(
  resourceId: string,
  newStatus: string
): Promise<
  | { error: string; status: number }
  | { resource: UpdatedResource }
> {
  if (!VALID_STATUSES.includes(newStatus as ResourceStatusValue)) {
    return {
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      status: 400,
    };
  }

  // Fetch current status
  const current = await pool.query(
    `SELECT "id", "status" FROM "Resource" WHERE "id" = $1`,
    [resourceId]
  );

  if (current.rows.length === 0) {
    return { error: "Resource not found", status: 404 };
  }

  const currentStatus = current.rows[0].status;
  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowedNext.includes(newStatus)) {
    return {
      error: `Invalid status transition: ${currentStatus} → ${newStatus}`,
      status: 400,
    };
  }

  const result = await pool.query<UpdatedResource>(
    `UPDATE "Resource"
     SET "status" = $1::"ResourceStatus"
     WHERE "id" = $2
     RETURNING "id", "name", "type", "capacity_total", "capacity_used", "status", "disaster_types", "created_at"`,
    [newStatus, resourceId]
  );

  return { resource: result.rows[0] };
}
