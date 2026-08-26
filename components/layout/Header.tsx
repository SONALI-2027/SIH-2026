import Link from "next/link";
import { MomentumLogo, SIHLogo } from "./Brand";
export function Header() { return <header className="flex h-18 items-center justify-between border-b border-white/20 bg-[#9b7653] px-5 shadow-[0_8px_18px_rgba(92,65,40,0.18),inset_0_-2px_0_rgba(92,65,40,0.12)] sm:px-8"><MomentumLogo /><div className="flex items-center gap-3"><Link href="/" aria-label="Go to Momentum home" title="Home" className="tap grid h-10 w-10 place-items-center rounded-xl border border-white/35 bg-[#6f523d] font-display text-xl font-bold text-[#fffaf3]">⌂</Link><SIHLogo /></div></header>; }
