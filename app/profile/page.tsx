import { Card } from "@/components/ui/Card";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
export default function ProfilePage() { return <div className="space-y-7"><header><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7653]">Local preferences</p><h1 className="font-display mt-2 text-4xl font-bold tracking-tight">Profile</h1><p className="mt-3 text-[#776b60]">Personalize Momentum for the way you need it.</p></header><Card><ProfileSettings /></Card></div>; }
