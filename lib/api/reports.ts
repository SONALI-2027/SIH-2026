import type { DisasterReport } from "@/types";

export async function submitReport(data: Omit<DisasterReport, "id" | "status" | "createdAt">) {
  // TODO: BACKEND INTEGRATION
  return { id: `MOCK-${Date.now()}`, status: "Submitted" as const, ...data, createdAt: "Just now" };
}
