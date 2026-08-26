import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return <div className="space-y-10">
    <section className="max-w-2xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#d9473f]">Safety is just a tap away</p><h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Disaster Management Cititzen panel</h1><p className="mt-4 max-w-xl text-lg leading-8 text-[#776b60]">Seek help, report your situation, offer a helping hand, and stay connected to your reports.</p></section>
    <section className="flex flex-col items-center gap-6 py-4" aria-label="Emergency actions"><Link href="/report" className="emergency-pulse tap grid min-h-44 w-44 place-items-center rounded-full bg-[#d9473f] p-7 text-center text-xl font-bold text-white drop-shadow-lg sm:min-h-56 sm:w-56 sm:text-2xl">REPORT<br />EMERGENCY</Link><Link href="/volunteer" className="tap flex min-h-16 w-full max-w-xs items-center justify-center rounded-2xl bg-[#3976a8] px-6 text-lg font-bold text-white">VOLUNTEER</Link></section>
    <section className="grid gap-4 sm:grid-cols-2"><Card><p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9b7653]">Emergency tip</p><p className="mt-3 font-display text-xl font-bold">Stay calm and move to a safe location.</p><p className="mt-2 leading-6 text-[#776b60]">Accurate details help responders understand the situation quickly.</p></Card><Card><p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9b7653]">Quick status</p><p className="mt-3 font-display text-xl font-bold">Your safety matters.</p><p className="mt-2 leading-6 text-[#776b60]">Need immediate assistance? Report an emergency now.</p></Card></section>
  </div>;
}
