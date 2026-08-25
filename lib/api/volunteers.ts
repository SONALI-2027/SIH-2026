import type { VolunteerRequest } from "@/types";

export async function submitVolunteerRequest(data: Omit<VolunteerRequest, "id" | "createdAt">) {
  // TODO: BACKEND INTEGRATION
  return { id: `MOCK-${Date.now()}`, createdAt: "Just now", ...data };
}
