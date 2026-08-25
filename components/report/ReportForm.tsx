"use client";
import { useState } from "react";
import { DISASTER_TYPES } from "@/lib/constants";
import { submitReport } from "@/lib/api/reports";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function ReportForm() {
  const [form, setForm] = useState({ reporterName: "", location: "", disasterType: DISASTER_TYPES[0], injured: 0, casualties: 0, immediateHelpNeeded: false, isSafe: true });
  const [message, setMessage] = useState("");
  const update = (key: string, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }));
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); await submitReport(form); setMessage("Emergency report submitted successfully."); }
  return <form onSubmit={handleSubmit} className="space-y-5"><div className="grid gap-5 md:grid-cols-2"><Input label="Reporter Name" placeholder="Your name" required value={form.reporterName} onChange={(event) => update("reporterName", event.target.value)} /><div><Input label="Location" placeholder="Current location" required value={form.location} onChange={(event) => update("location", event.target.value)} /><button type="button" className="mt-2 text-sm font-bold text-[#3978a8]" onClick={() => setMessage("Location detection will be connected later.")}>Use my location</button></div><Select label="Type of Disaster" options={DISASTER_TYPES} value={form.disasterType} onChange={(event) => update("disasterType", event.target.value)} /><Input label="Number of Injured" type="number" min="0" value={form.injured} onChange={(event) => update("injured", Number(event.target.value))} /><Input label="Casualties" type="number" min="0" value={form.casualties} onChange={(event) => update("casualties", Number(event.target.value))} /></div><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => update("immediateHelpNeeded", !form.immediateHelpNeeded)} aria-pressed={form.immediateHelpNeeded} className={`min-h-14 rounded-2xl border px-4 text-left font-bold ${form.immediateHelpNeeded ? "border-[#d9473f] bg-[#fff0e8] text-[#d9473f]" : "border-[#5c4128]/10 bg-[#fffaf3]"}`}>I need immediate help <span className="float-right">{form.immediateHelpNeeded ? "ON" : "OFF"}</span></button><button type="button" onClick={() => update("isSafe", !form.isSafe)} aria-pressed={form.isSafe} className={`min-h-14 rounded-2xl border px-4 text-left font-bold ${form.isSafe ? "border-[#4d886d] bg-[#edf7ef] text-[#4d886d]" : "border-[#d9473f] bg-[#fff0e8] text-[#d9473f]"}`}>{form.isSafe ? "I'm Safe" : "I Need Help"}<span className="float-right">{form.isSafe ? "SAFE" : "HELP"}</span></button></div><Button type="submit" variant="danger" className="w-full text-lg">Submit Emergency Report</Button>{message && <p role="status" className="rounded-2xl bg-[#edf7ef] p-4 font-semibold text-[#356b51]">{message}</p>}</form>;
}
