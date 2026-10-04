import { Blob } from 'buffer';

const BASE_URL = "http://localhost:4000";
const AUTH_HEADER = { "x-authority-token": "demo-authority-token" };

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("🚀 Starting SIH-2026 Disaster Management Platform Simulation...");

  // Step 1: Submit three reports from three different sessions at same coordinates (Mumbai)
  console.log("\n--- Step 1: Submitting 3 reports from different sessions (session-A, session-B, session-C) ---");
  const coords = { lat: "19.0760", lng: "72.8777" };
  const sessions = ["session-A", "session-B", "session-C"];
  const reportIds: string[] = [];

  for (const session of sessions) {
    const formData = new FormData();
    formData.append("session_id", session);
    formData.append("type", "flood");
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);
    formData.append("description", `Flooding reported by ${session}`);

    // Create a mock file blob for photo upload
    const blob = new Blob(["mock image data"], { type: "image/png" });
    formData.append("photo", blob as any, "flood.png");

    console.log(`Submitting report for ${session}...`);
    const res = await fetch(`${BASE_URL}/api/reports`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Report submission failed for ${session}: ${errText}`);
    }

    const data = await res.json() as any;
    console.log(`✅ Report submitted. ID: ${data.report.id}, Status: ${data.report.status}`);
    reportIds.push(data.report.id);
    await delay(1000);
  }

  // Step 2: Fetch incidents to verify auto-clustering & find a verified report ID
  console.log("\n--- Step 2: Fetching incidents to locate verified report ---");
  const incidentsRes = await fetch(`${BASE_URL}/api/incidents`);
  if (!incidentsRes.ok) {
    throw new Error(`Failed to fetch incidents: ${await incidentsRes.text()}`);
  }
  const incidents = await incidentsRes.json() as any[];
  console.log(`Total incidents found: ${incidents.length}`);

  const verifiedIncident = incidents.find(
    (inc) => reportIds.includes(inc.id) && inc.status === "verified"
  );

  if (!verifiedIncident) {
    throw new Error("Could not find a verified incident in the database cluster!");
  }
  console.log(`✅ Found verified incident: ${verifiedIncident.id} (${verifiedIncident.type})`);

  // Step 3: Get shortlist for that report
  console.log(`\n--- Step 3: Getting resource shortlist for incident ${verifiedIncident.id} ---`);
  const shortlistRes = await fetch(`${BASE_URL}/api/incidents/${verifiedIncident.id}/shortlist`);
  if (!shortlistRes.ok) {
    throw new Error(`Failed to get shortlist: ${await shortlistRes.text()}`);
  }
  const shortlist = await shortlistRes.json() as any[];
  console.log(`Shortlisted resources:`);
  shortlist.forEach((res, index) => {
    console.log(`  [${index + 1}] ${res.name} (${res.type}) - Distance: ${Math.round(res.distance_meters)}m`);
  });

  if (shortlist.length === 0) {
    throw new Error("Shortlist is empty! Make sure the seed script has been run.");
  }

  const selectedResource = shortlist[0];
  console.log(`✅ Selected resource: ${selectedResource.name} (ID: ${selectedResource.id})`);
  await delay(1000);

  // Step 4: Confirm allocation (requires authority token)
  console.log(`\n--- Step 4: Confirming allocation ---`);
  const confirmRes = await fetch(`${BASE_URL}/api/allocations/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...AUTH_HEADER },
    body: JSON.stringify({
      report_id: verifiedIncident.id,
      resource_id: selectedResource.id,
    }),
  });

  if (!confirmRes.ok) {
    throw new Error(`Failed to confirm allocation: ${await confirmRes.text()}`);
  }
  const confirmData = await confirmRes.json() as any;
  console.log(`✅ Allocation confirmed. Status: ${confirmData.allocation.status}`);
  console.log(`Report status updated to: ${confirmData.report.status}`);
  console.log(`Resource status updated to: ${confirmData.resource.status} (Capacity used: ${confirmData.resource.capacity_used}/${confirmData.resource.capacity_total})`);
  await delay(1000);

  // Step 5: Update resource status to at_scene (requires authority token)
  console.log(`\n--- Step 5: Updating resource status to 'at_scene' ---`);
  const statusRes = await fetch(`${BASE_URL}/api/resources/${selectedResource.id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...AUTH_HEADER },
    body: JSON.stringify({ status: "at_scene" }),
  });

  if (!statusRes.ok) {
    throw new Error(`Failed to update status: ${await statusRes.text()}`);
  }
  const statusData = await statusRes.json() as any;
  console.log(`✅ Resource status updated: ${statusData.name} is now ${statusData.status}`);
  await delay(1000);

  // Step 6: Resolve the incident (requires authority token)
  console.log(`\n--- Step 6: Resolving incident ${verifiedIncident.id} ---`);
  const resolveRes = await fetch(`${BASE_URL}/api/incidents/${verifiedIncident.id}/resolve`, {
    method: "POST",
    headers: { ...AUTH_HEADER },
  });

  if (!resolveRes.ok) {
    throw new Error(`Failed to resolve incident: ${await resolveRes.text()}`);
  }
  const resolveData = await resolveRes.json() as any;
  console.log(`✅ Incident resolved:`);
  console.log(`Report status: ${resolveData.report.status}`);
  console.log(`Allocation status: ${resolveData.allocation.status}`);
  console.log(`Resource status: ${resolveData.resource.status} (Capacity used: ${resolveData.resource.capacity_used}/${resolveData.resource.capacity_total})`);
  await delay(1000);

  // Step 7: Fetch reports for one session to verify resolution status
  console.log(`\n--- Step 7: Verifying citizen status view for 'session-A' ---`);
  const citizenRes = await fetch(`${BASE_URL}/api/reports?session_id=session-A`);
  if (!citizenRes.ok) {
    throw new Error(`Failed to fetch citizen reports: ${await citizenRes.text()}`);
  }
  const citizenReports = await citizenRes.json() as any[];
  console.log(`Reports submitted by session-A:`);
  citizenReports.forEach((rep) => {
    console.log(`- ID: ${rep.id}, Type: ${rep.type}, Status: ${rep.status}, Location: ${rep.location_wkt}`);
  });

  console.log("\n🎉 Simulation completed successfully!");
}

run().catch((err) => {
  console.error("\n❌ Simulation failed:", err.message);
  process.exit(1);
});
