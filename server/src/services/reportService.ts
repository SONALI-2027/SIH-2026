import pool from '../db';
import { insertReportWithLocation, findNearbyReports } from '../utils/geo';

interface CreateReportInput {
  session_id: string;
  type: string;
  description?: string;
  photo_url?: string;
  lat: number;
  lng: number;
}

const VALID_TYPES = ['flood', 'cyclone', 'landslide', 'medical', 'fire', 'other'];

export async function createReport(data: CreateReportInput) {
  const { session_id, type, description, photo_url, lat, lng } = data;

  // Required fields
  if (!session_id || !type || lat === undefined || lng === undefined) {
    throw new Error('Missing required fields: session_id, type, lat, lng');
  }

  // Type validation
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Coordinate range validation
  if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid lat: must be a number between -90 and 90');
  }
  if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) {
    throw new Error('Invalid lng: must be a number between -180 and 180');
  }

  // Description length validation
  if (description && description.length > 500) {
    throw new Error('Description must be 500 characters or fewer');
  }

  // Insert report with location via raw SQL
  const report = await insertReportWithLocation({
    session_id,
    type,
    description,
    photo_url,
    lat,
    lng,
  });

  // Find all unverified reports in the same cluster
  const nearbyReports = await findNearbyReports(lat, lng);

  // Count distinct sessions
  const distinctSessions = new Set(nearbyReports.map(r => r.session_id));

  if (distinctSessions.size >= 3) {
    const ids = nearbyReports.map(r => r.id);

    // Update all reports in cluster to verified (id column is text)
    await pool.query(
      `UPDATE "Report" SET status = 'verified' WHERE id = ANY($1::text[])`,
      [ids]
    );

    // Fetch the updated reports
    const verifiedResult = await pool.query(
      `SELECT * FROM "Report" WHERE id = ANY($1::text[])`,
      [ids]
    );

    return { report, verifiedReports: verifiedResult.rows };
  }

  return { report };
}

export async function getCitizenReportsBySession(sessionId: string) {
  const result = await pool.query(
    `SELECT
      "id", "session_id", "type", "description", "photo_url", "status", "created_at",
      ST_AsText("location") AS location_wkt
     FROM "Report"
     WHERE "session_id" = $1
     ORDER BY "created_at" DESC`,
    [sessionId]
  );
  return result.rows;
}