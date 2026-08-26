import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { NavIcon } from "./NavIcon";

export function MobileBottomNav() {
  return <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-4 gap-1 rounded-[1.5rem] border border-white/25 bg-[#9b7653] p-2 shadow-[14px_16px_28px_rgba(92,65,40,0.28),inset_0_2px_0_rgba(255,255,255,0.28)] lg:hidden">
    {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-[#fffaf3] hover:bg-[#6f523d]" aria-label={item.label}><NavIcon type={item.icon} size={18} /><span>{item.shortLabel}</span></Link>)}
  </nav>;
}
