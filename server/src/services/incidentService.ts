import pool from "../db";

// ── Interfaces ─────────────────────────────────

export interface IncidentRow {
  id: string;
  session_id: string;
  type: string;
  description: string | null;
  photo_url: string | null;
  status: string;
  created_at: Date;
  location_wkt: string | null;
}

export interface ShortlistResource {
  id: string;
  name: string;
  type: string;
  capacity_total: number;
  capacity_used: number;
  disaster_types: string[];
  status: string;
  distance_meters: number;
}

// ── Service Functions ──────────────────────────

/**
 * Fetch all reports with location as WKT.
 */
export async function getAllIncidents(): Promise<IncidentRow[]> {
  const result = await pool.query<IncidentRow>(
    `SELECT
      "id", "session_id", "type", "description", "photo_url",
      "status", "created_at",
      ST_AsText("location") AS location_wkt
    FROM "Report"
    ORDER BY "created_at" DESC`
  );
  return result.rows;
}

/**
 * Get the top 3 closest compatible resources for a verified incident.
 */
export async function getShortlistForIncident(
  incidentId: string
): Promise<
  | { error: string; status: number }
  | { resources: ShortlistResource[] }
> {
  const reportResult = await pool.query(
    `SELECT "id", "type", "status", ST_X("location") AS lng, ST_Y("location") AS lat
     FROM "Report"
     WHERE "id" = $1`,
    [incidentId]
  );

  if (reportResult.rows.length === 0) {
    return { error: "Report not found", status: 404 };
  }

  const report = reportResult.rows[0];

  if (report.status !== "verified") {
    return { error: "Report is not verified", status: 400 };
  }

  const resourceResult = await pool.query<ShortlistResource>(
    `SELECT
      "id", "name", "type",
      "capacity_total", "capacity_used",
      "disaster_types", "status",
      ST_Distance(
        "location"::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) AS distance_meters
    FROM "Resource"
    WHERE "capacity_used" < "capacity_total"
      AND $3 = ANY("disaster_types")
      AND "location" IS NOT NULL
    ORDER BY distance_meters ASC
    LIMIT 3`,
    [report.lng, report.lat, report.type]
  );

  return { resources: resourceResult.rows };
}

/**
 * Resolve an in_progress incident:
 * - Set report to resolved
 * - Set associated allocation to resolved
 * - Free the resource (decrement capacity_used, set available)
 */
export async function resolveIncident(
  incidentId: string
): Promise<
  | { error: string; status: number }
  | { report: Record<string, unknown>; allocation: Record<string, unknown>; resource: Record<string, unknown> }
> {
  const reportCheck = await pool.query(
    `SELECT "id", "status" FROM "Report" WHERE "id" = $1`,
    [incidentId]
  );

  if (reportCheck.rows.length === 0) {
    return { error: "Report not found", status: 404 };
  }

  const currentStatus = reportCheck.rows[0].status;

  if (currentStatus === "resolved") {
    return { error: "Incident already resolved", status: 400 };
  }

  if (currentStatus !== "in_progress") {
    return { error: "Report is not in_progress", status: 400 };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update report → resolved
    const reportResult = await client.query(
      `UPDATE "Report"
       SET "status" = 'resolved'::"ReportStatus"
       WHERE "id" = $1
       RETURNING "id", "session_id", "type", "description", "photo_url", "status", "created_at"`,
      [incidentId]
    );

    // Find the active allocation for this report
    const activeAllocResult = await client.query(
      `SELECT "id", "resource_id"
       FROM "Allocation"
       WHERE "report_id" = $1
         AND "status" IN ('confirmed'::"AllocationStatus", 'en_route'::"AllocationStatus", 'at_scene'::"AllocationStatus")
       ORDER BY "created_at" DESC
       LIMIT 1`,
      [incidentId]
    );

    let allocationResult = { rows: [] as Record<string, any>[] };
    let resourceResult = { rows: [] as Record<string, any>[] };

    if (activeAllocResult.rows.length > 0) {
      const allocationId = activeAllocResult.rows[0].id;
      const resourceId = activeAllocResult.rows[0].resource_id;

      // Update Allocation status → resolved
      allocationResult = await client.query(
        `UPDATE "Allocation"
         SET "status" = 'resolved'::"AllocationStatus"
         WHERE "id" = $1
         RETURNING "id", "report_id", "resource_id", "status", "recommended_at", "confirmed_at", "confirmed_by", "created_at"`,
        [allocationId]
      );

      // Free the resource — only decrement if capacity_used > 0
      resourceResult = await client.query(
        `UPDATE "Resource"
         SET "capacity_used" = GREATEST("capacity_used" - 1, 0),
             "status" = 'available'::"ResourceStatus"
         WHERE "id" = $1 AND "capacity_used" > 0
         RETURNING "id", "name", "type", "capacity_total", "capacity_used", "status", "disaster_types", "created_at"`,
        [resourceId]
      );

      // If capacity_used was already 0, still fetch the resource for the response
      if (resourceResult.rows.length === 0) {
        resourceResult = await client.query(
          `SELECT "id", "name", "type", "capacity_total", "capacity_used", "status", "disaster_types", "created_at"
           FROM "Resource" WHERE "id" = $1`,
          [resourceId]
        );
      }
    }

    await client.query("COMMIT");

    return {
      report: reportResult.rows[0],
      allocation: allocationResult.rows[0] || {},
      resource: resourceResult.rows[0] || {},
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
