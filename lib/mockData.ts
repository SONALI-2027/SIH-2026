import type { DisasterReport, VolunteerRequest } from "@/types";

export const mockReports: DisasterReport[] = [
  { id: "R-1042", reporterName: "user1", location: "city1", disasterType: "Flood", injured: 2, casualties: 0, immediateHelpNeeded: true, isSafe: true, status: "Under Review", createdAt: "Today, 3:42 PM" },
  { id: "R-1038", reporterName: "user2", location: "city2", disasterType: "Medical Emergency", injured: 1, casualties: 0, immediateHelpNeeded: false, isSafe: true, status: "Resolved", createdAt: "Yesterday" },
];
export const mockVolunteerRequests: VolunteerRequest[] = [
  { id: "V-220", name: "user 3", location: "city3", category: "Food distribution", createdAt: "Today" },
];
