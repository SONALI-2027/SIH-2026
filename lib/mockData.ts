import type { DisasterReport, VolunteerRequest } from "@/types";

export const mockReports: DisasterReport[] = [
  { id: "R-1042", reporterName: "Ananya Das", location: "Bhubaneswar", disasterType: "Flood", injured: 2, casualties: 0, immediateHelpNeeded: true, isSafe: true, status: "Under Review", createdAt: "Today, 3:42 PM" },
  { id: "R-1038", reporterName: "Ananya Das", location: "Cuttack", disasterType: "Medical Emergency", injured: 1, casualties: 0, immediateHelpNeeded: false, isSafe: true, status: "Resolved", createdAt: "Yesterday" },
];
export const mockVolunteerRequests: VolunteerRequest[] = [
  { id: "V-220", name: "Rohan Patnaik", location: "Bhubaneswar", category: "Food distribution", createdAt: "Today" },
];
