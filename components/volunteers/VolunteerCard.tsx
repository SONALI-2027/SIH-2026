"use client";

import { useState } from "react";
import { Loader2, MapPin, Phone, Send } from "lucide-react";
import { Volunteer } from "@/types/volunteer";
import { Badge } from "@/components/ui/Badge";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSendRequest() {
    setLoading(true);
    window.setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 700);
  }

  return <article className="resource-card"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#1b3324]">{volunteer.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-[#607466]"><MapPin size={13} />{volunteer.location}</p></div><Badge tone={volunteer.status === "Assigned" ? "green" : volunteer.status === "Contacted" ? "neutral" : "amber"}>{volunteer.status}</Badge></div><div className="mt-4 grid gap-2 text-xs text-[#607466] sm:grid-cols-2"><span><b className="block text-[#284a33]">{volunteer.service}</b>Preferred service</span><span><b className="block text-[#284a33]">{volunteer.availability}</b>Availability</span><span className="flex items-center gap-1"><Phone size={13} />{volunteer.contact}</span></div><button className="action-button primary mt-4 flex items-center gap-2" onClick={handleSendRequest} disabled={loading || sent} aria-live="polite">{loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}{loading ? "Sending..." : sent ? "Request sent" : "Send request"}</button></article>;
}
