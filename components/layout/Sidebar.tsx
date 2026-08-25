import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { NavIcon } from "./NavIcon";

export function Sidebar() {
  return <aside className="hidden w-56 shrink-0 flex-col border-r border-[#5c4128]/10 px-4 py-6 lg:flex">
    <p className="mb-8 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7653]">Your response hub</p>
    <nav aria-label="Primary navigation" className="space-y-2">
      {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="tap flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold text-[#776b60] hover:bg-[#fffaf3] hover:text-[#2c2621]"><NavIcon type={item.icon} /><span>{item.label}</span></Link>)}
    </nav>
    <div className="clay mt-auto rounded-2xl p-4 text-sm"><p className="font-display font-bold">Stay prepared</p><p className="mt-1 text-xs leading-5 text-[#776b60]">Small, clear details help responders move faster.</p></div>
  </aside>;
}
