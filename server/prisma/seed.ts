import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Mumbai center: 19.0760° N, 72.8777° E
// Generate coordinates within ~10 km radius
function mumbaiCoord(latOffset: number, lonOffset: number): { lat: number; lon: number } {
  return {
    lat: 19.076 + latOffset,
    lon: 72.8777 + lonOffset,
  };
}

interface ResourceSeed {
  name: string;
  type: string;
  capacity_total: number;
  disaster_types: string[];
  lat: number;
  lon: number;
}

const resources: ResourceSeed[] = [
  // ── 5 Shelters (capacity 100–500) ──
  {
    name: "Dharavi Community Shelter",
    type: "shelter",
    capacity_total: 350,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(0.012, -0.015),
  },
  {
    name: "Bandra Relief Camp",
    type: "shelter",
    capacity_total: 500,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(0.025, -0.008),
  },
  {
    name: "Andheri East Shelter",
    type: "shelter",
    capacity_total: 200,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(0.045, -0.022),
  },
  {
    name: "Chembur Municipal Shelter",
    type: "shelter",
    capacity_total: 150,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(-0.015, 0.018),
  },
  {
    name: "Kurla West Emergency Shelter",
    type: "shelter",
    capacity_total: 100,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(0.008, 0.005),
  },

  // ── 4 Rescue Teams (capacity 10–20) ──
  {
    name: "NDRF Team Alpha",
    type: "rescue_team",
    capacity_total: 20,
    disaster_types: ["flood", "cyclone", "landslide", "fire"],
    ...mumbaiCoord(0.003, -0.005),
  },
  {
    name: "NDRF Team Bravo",
    type: "rescue_team",
    capacity_total: 15,
    disaster_types: ["flood", "cyclone", "landslide", "fire"],
    ...mumbaiCoord(-0.02, 0.01),
  },
  {
    name: "Mumbai Fire Brigade Unit 7",
    type: "rescue_team",
    capacity_total: 12,
    disaster_types: ["fire", "cyclone", "landslide"],
    ...mumbaiCoord(0.03, 0.015),
  },
  {
    name: "Navy Rescue Squad",
    type: "rescue_team",
    capacity_total: 10,
    disaster_types: ["flood", "cyclone"],
    ...mumbaiCoord(-0.035, -0.012),
  },

  // ── 3 Boats (capacity 5–10) ──
  {
    name: "Inflatable Rescue Boat IR-1",
    type: "boat",
    capacity_total: 8,
    disaster_types: ["flood"],
    ...mumbaiCoord(-0.008, -0.02),
  },
  {
    name: "Motorized Dinghy MD-3",
    type: "boat",
    capacity_total: 10,
    disaster_types: ["flood"],
    ...mumbaiCoord(0.018, -0.03),
  },
  {
    name: "Flat-bottom Rescue Craft FRC-2",
    type: "boat",
    capacity_total: 5,
    disaster_types: ["flood"],
    ...mumbaiCoord(-0.025, 0.008),
  },

  // ── 3 Medical Vans (capacity 2–5) ──
  {
    name: "Mobile ICU Van MV-01",
    type: "medical_van",
    capacity_total: 3,
    disaster_types: ["flood", "cyclone", "landslide", "medical"],
    ...mumbaiCoord(0.01, 0.025),
  },
  {
    name: "First Aid Response Van FA-02",
    type: "medical_van",
    capacity_total: 5,
    disaster_types: ["flood", "cyclone", "landslide", "medical"],
    ...mumbaiCoord(-0.04, -0.005),
  },
  {
    name: "Trauma Care Unit TC-01",
    type: "medical_van",
    capacity_total: 2,
    disaster_types: ["flood", "cyclone", "landslide", "medical", "fire"],
    ...mumbaiCoord(0.022, -0.018),
  },

  // ── 2 Food Stocks (capacity 500–1000) ──
  {
    name: "SDMA Central Warehouse",
    type: "food_stock",
    capacity_total: 1000,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(0.005, -0.01),
  },
  {
    name: "Municipal Ration Depot Sion",
    type: "food_stock",
    capacity_total: 500,
    disaster_types: ["flood", "cyclone", "landslide"],
    ...mumbaiCoord(-0.012, 0.022),
  },

  // ── 3 Ambulances (capacity 1–2) ──
  {
    name: "Ambulance AMB-101",
    type: "ambulance",
    capacity_total: 2,
    disaster_types: ["flood", "cyclone", "landslide", "medical", "fire"],
    ...mumbaiCoord(0.015, 0.008),
  },
  {
    name: "Ambulance AMB-102",
    type: "ambulance",
    capacity_total: 1,
    disaster_types: ["flood", "cyclone", "landslide", "medical", "fire"],
    ...mumbaiCoord(-0.005, -0.025),
  },
  {
    name: "Ambulance AMB-103",
    type: "ambulance",
    capacity_total: 2,
    disaster_types: ["flood", "cyclone", "landslide", "medical", "fire"],
    ...mumbaiCoord(0.038, -0.003),
  },
];

async function main() {
  console.log("🌱 Seeding database with Mumbai resources...\n");

  // Clear existing data (respecting FK constraints)
  await prisma.allocation.deleteMany();
  await prisma.report.deleteMany();
  await prisma.resource.deleteMany();
  console.log("  🗑️  Cleared existing data.\n");

  for (const r of resources) {
    // Build the disaster_types array literal for PostgreSQL
    const typesArray = `{${r.disaster_types.join(",")}}`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Resource" (
        "id", "name", "type", "capacity_total", "capacity_used",
        "location", "status", "disaster_types", "created_at"
      ) VALUES (
        gen_random_uuid(),
        $1,
        $2::"ResourceType",
        $3,
        0,
        ST_SetSRID(ST_MakePoint($4, $5), 4326),
        'available'::"ResourceStatus",
        $6::text[],
        NOW()
      )`,
      r.name,
      r.type,
      r.capacity_total,
      r.lon,
      r.lat,
      typesArray,
    );

    console.log(`  ✅  ${r.type.padEnd(12)} | ${r.name}`);
  }

  console.log(`\n🎉 Seeded ${resources.length} resources around Mumbai.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

