import { Card } from "@/components/ui/Card";
import { ReportForm } from "@/components/report/ReportForm";
export default function ReportPage() { return <div className="space-y-7"><header><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9473f]">Report</p><h1 className="font-display mt-2 text-4xl font-bold tracking-tight">Report an Emergency</h1><p className="mt-3 max-w-2xl text-[#776b60]">Provide the information below so responders can understand the situation quickly.</p></header><Card><ReportForm /></Card></div>; }
