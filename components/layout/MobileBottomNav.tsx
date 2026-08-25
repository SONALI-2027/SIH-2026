import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { NavIcon } from "./NavIcon";

export function MobileBottomNav() {
  return <nav aria-label="Mobile navigation" className="clay fixed inset-x-3 bottom-3 z-20 grid grid-cols-4 gap-1 rounded-2xl p-2 lg:hidden">
    {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-[#776b60] hover:bg-[#ead8c1]" aria-label={item.label}><NavIcon type={item.icon} size={18} /><span>{item.shortLabel}</span></Link>)}
  </nav>;
}
