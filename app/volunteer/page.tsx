import { Card } from "@/components/ui/Card";
import { VolunteerForm } from "@/components/volunteer/VolunteerForm";
export default function VolunteerPage() { return <div className="space-y-7"><header><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3978a8]">Volunteer</p><h1 className="font-display mt-2 text-4xl font-bold tracking-tight">Become a Volunteer</h1><p className="mt-3 max-w-2xl text-[#776b60]">Help responders and communities during emergencies.</p></header><Card><VolunteerForm /></Card></div>; }
