"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { PageContainer } from "./PageContainer";
import { LANGUAGES } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  return <div className="min-h-screen">
    <Header />
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1440px]">
      <Sidebar />
      <div className="min-w-0 flex-1"><PageContainer>{children}</PageContainer></div>
    </div>
    <MobileBottomNav />
    {!hasChosenLanguage && <div className="fixed inset-0 z-50 grid place-items-center bg-[#2c2621]/30 p-4 backdrop-blur-[2px]">
      <section role="dialog" aria-modal="true" aria-labelledby="language-title" className="clay w-full max-w-lg rounded-[2rem] p-6 sm:p-9">
        <div className="mb-7"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9473f]">Momentum</p><h1 id="language-title" className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Preferred Language</h1><p className="mt-3 text-[#776b60]">Choose what feels most natural. You can change this later in Profile.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">{LANGUAGES.map((item) => <button key={item.code} type="button" onClick={() => setLanguage(item.code)} className={`tap min-h-14 rounded-2xl border px-4 text-left font-semibold ${language === item.code ? "border-[#d9473f] bg-[#fff0e8] text-[#2c2621]" : "border-[#5c4128]/10 bg-[#fffaf3] text-[#776b60]"}`} aria-pressed={language === item.code}><span className="mr-3 inline-block h-3 w-3 rounded-full border-2 border-current align-middle" />{item.label}{language === item.code && <span className="float-right text-[#d9473f]">Selected</span>}</button>)}</div>
        <button type="button" onClick={() => setHasChosenLanguage(true)} className="tap mt-7 min-h-14 w-full rounded-2xl bg-[#2c2621] px-6 font-bold text-[#fffaf3]">Continue to Momentum</button>
      </section>
    </div>}
  </div>;
}
