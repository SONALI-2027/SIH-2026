import type { LanguageCode, ReportStatus, VolunteerCategory } from "@/types";

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" }, { code: "hi", label: "Hindi" }, { code: "or", label: "Odia" }, { code: "bn", label: "Bengali" }, { code: "te", label: "Telugu" },
];
export const DISASTER_TYPES = ["Flood", "Earthquake", "Cyclone", "Fire", "Landslide", "Accident", "Building Collapse", "Medical Emergency", "Other"];
export const VOLUNTEER_CATEGORIES: VolunteerCategory[] = ["Rescue assistance", "Medical assistance", "Food distribution", "Shelter support", "Transportation", "Communication/support", "Donation/logistics", "Other"];
export const REPORT_STATUSES: ReportStatus[] = ["Submitted", "Under Review", "Responding", "Resolved"];
export const NAV_ITEMS = [
  { href: "/report", label: "Report", shortLabel: "Report", icon: "alert" },
  { href: "/volunteer", label: "Volunteer", shortLabel: "Volunteer", icon: "hand" },
  { href: "/history", label: "My History", shortLabel: "History", icon: "clock" },
  { href: "/profile", label: "Profile", shortLabel: "Profile", icon: "user" },
];
