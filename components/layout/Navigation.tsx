"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, ClipboardCheck, FileWarning, Package, UsersRound } from "lucide-react";

const items = [{ href: "/admin/profile", label: "Profile", icon: CircleUserRound }, { href: "/admin/verified", label: "Verified", icon: ClipboardCheck }, { href: "/admin/unverified", label: "Unverified", icon: FileWarning }, { href: "/admin/volunteers", label: "Volunteers", icon: UsersRound }, { href: "/admin/resources", label: "Resources", icon: Package }];

export function Navigation() {
  const pathname = usePathname();
  return <><aside className="sidebar">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}><Icon size={18} /><span>{label}</span></Link>)}</aside><nav className="mobile-nav">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={18} /><span>{label}</span></Link>)}</nav></>;
}
