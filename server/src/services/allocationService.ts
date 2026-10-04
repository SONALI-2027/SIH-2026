import pool from "../db";

// ── Interfaces ─────────────────────────────────

export interface ConfirmAllocationInput {
  report_id: string;
  resource_id: string;
}

export interface ConfirmAllocationResult {
  allocation: Record<string, unknown>;
  report: Record<string, unknown>;
  resource: Record<string, unknown>;
}

// ── Service Functions ──────────────────────────

/**
 * Confirm an allocation: create the Allocation record, update Report to in_progress,
 * increment Resource.capacity_used, set Resource to en_route.
 * All within a transaction.
 */
export async function confirmAllocation(
  input: ConfirmAllocationInput
): Promise<
  | { error: string; status: number }
  | ConfirmAllocationResult
> {
  const { report_id, resource_id } = input;

  if (!report_id || !resource_id) {
    return { error: "Missing required fields: report_id, resource_id", status: 400 };
  }

  // Validate report exists and is verified (not already in_progress or resolved)
  const reportCheck = await pool.query(
    `SELECT "id", "status" FROM "Report" WHERE "id" = $1`,
    [report_id]
  );

  if (reportCheck.rows.length === 0) {
    return { error: "Report not found", status: 404 };
  }

  const reportStatus = reportCheck.rows[0].status;

  if (reportStatus === "in_progress" || reportStatus === "resolved") {
    return { error: "Report already in progress or resolved", status: 400 };
  }

  if (reportStatus !== "verified") {
    return { error: "Report is not verified", status: 400 };
  }

  // Validate resource exists, is available, and has capacity
  const resourceCheck = await pool.query(
    `SELECT "id", "status", "capacity_total", "capacity_used"
     FROM "Resource"
     WHERE "id" = $1`,
    [resource_id]
  );

  if (resourceCheck.rows.length === 0) {
    return { error: "Resource not found", status: 404 };
  }

  const resource = resourceCheck.rows[0];

  if (resource.status !== "available") {
    return { error: "Resource is not available", status: 400 };
  }

  if (resource.capacity_used >= resource.capacity_total) {
    return { error: "Resource has no available capacity", status: 400 };
  }

  // Begin transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Double-check capacity inside transaction (prevents race conditions)
    const capacityCheck = await client.query(
      `SELECT "capacity_total", "capacity_used" FROM "Resource" WHERE "id" = $1 FOR UPDATE`,
      [resource_id]
    );

    if (capacityCheck.rows[0].capacity_used >= capacityCheck.rows[0].capacity_total) {
      await client.query("ROLLBACK");
      return { error: "Resource has no available capacity", status: 400 };
    }

    // 1. Create Allocation
    const allocationResult = await client.query(
      `INSERT INTO "Allocation" (
        "id", "report_id", "resource_id", "status",
        "recommended_at", "confirmed_at", "confirmed_by", "created_at"
      ) VALUES (
        gen_random_uuid(),
        $1, $2,
        'confirmed'::"AllocationStatus",
        NOW(), NOW(), 'authority-1', NOW()
      )
      RETURNING "id", "report_id", "resource_id", "status",
                "recommended_at", "confirmed_at", "confirmed_by", "created_at"`,
      [report_id, resource_id]
    );

    // 2. Update Report → in_progress
    const reportResult = await client.query(
      `UPDATE "Report"
       SET "status" = 'in_progress'::"ReportStatus"
       WHERE "id" = $1
       RETURNING "id", "session_id", "type", "description", "photo_url", "status", "created_at"`,
      [report_id]
    );

    // 3. Increment capacity_used and set status to en_route
    const resourceResult = await client.query(
      `UPDATE "Resource"
       SET "capacity_used" = "capacity_used" + 1,
           "status" = 'en_route'::"ResourceStatus"
       WHERE "id" = $1
       RETURNING "id", "name", "type", "capacity_total", "capacity_used", "status", "disaster_types", "created_at"`,
      [resource_id]
    );

    await client.query("COMMIT");

    return {
      allocation: allocationResult.rows[0],
      report: reportResult.rows[0],
      resource: resourceResult.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
