import pool from "../db";

export interface NearbyReport {
  id: string;
  session_id: string;
  type: string;
  description: string | null;
  photo_url: string | null;
  status: string;
  created_at: Date;
}

export interface InsertReportData {
  session_id: string;
  type: string;
  description?: string | null;
  photo_url?: string | null;
  lat: number;
  lng: number;
}

/**
 * Inserts a new report row including PostGIS geometry point.
 * Returns the inserted row (without the geometry column).
 */
export async function insertReportWithLocation(
  data: InsertReportData
): Promise<NearbyReport> {
  const { session_id, type, description, photo_url, lat, lng } = data;

  const result = await pool.query<NearbyReport>(
    `INSERT INTO "Report" (
      "id", "session_id", "type", "description", "photo_url",
      "location", "status", "created_at"
    ) VALUES (
      gen_random_uuid(),
      $1,
      $2::"ReportType",
      $3,
      $4,
      ST_SetSRID(ST_MakePoint($5, $6), 4326),
      'unverified'::"ReportStatus",
      NOW()
    )
    RETURNING "id", "session_id", "type", "description", "photo_url", "status", "created_at"`,
    [session_id, type, description ?? null, photo_url ?? null, lng, lat]
  );

  return result.rows[0];
}

/**
 * Finds unverified reports within `radiusMeters` of a point,
 * created within the last `timeWindowMinutes` minutes.
 * Uses ST_DWithin on geography for metre-accurate radius.
 */
export async function findNearbyReports(
  lat: number,
  lng: number,
  radiusMeters: number = 200,
  timeWindowMinutes: number = 15
): Promise<NearbyReport[]> {
  const result = await pool.query<NearbyReport>(
    `SELECT
      "id", "session_id", "type", "description", "photo_url", "status", "created_at"
    FROM "Report"
    WHERE "status" = 'unverified'
      AND ST_DWithin(
        "location"::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      AND "created_at" >= NOW() - INTERVAL '1 minute' * $4
    ORDER BY "created_at" DESC`,
    [lng, lat, radiusMeters, timeWindowMinutes]
  );

  return result.rows;
}