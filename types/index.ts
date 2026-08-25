export type LanguageCode = "en" | "hi" | "or" | "bn" | "te";
export type ReportStatus = "Submitted" | "Under Review" | "Responding" | "Resolved";
export type VolunteerCategory = "Rescue assistance" | "Medical assistance" | "Food distribution" | "Shelter support" | "Transportation" | "Communication/support" | "Donation/logistics" | "Other";

export interface DisasterReport {
  id: string;
  reporterName: string;
  location: string;
  disasterType: string;
  injured: number;
  casualties: number;
  immediateHelpNeeded: boolean;
  isSafe: boolean;
  status: ReportStatus;
  createdAt: string;
}

export interface VolunteerRequest { id: string; name: string; location: string; category: VolunteerCategory; createdAt: string; }
export interface UserProfile { name: string; language: LanguageCode; location: string; }
export interface NotificationSettings { notifications: boolean; locationServices: boolean; emergencyAlerts: boolean; largerText: boolean; reducedMotion: boolean; }
