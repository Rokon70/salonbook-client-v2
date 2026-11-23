"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowUpRight, CalendarDays, CreditCard, LayoutDashboard, LogOut, Menu,
  Scissors, Sparkles, UserCircle, Users, X, ListChecks,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "./Navbar";

const NAV = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: ListChecks },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: UserCircle },
  ],
};

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const role = user.role === "admin" ? "admin" : "customer";
  const items = NAV[role];
  const current = items.find((item) => item.exact ? pathname === item.href : pathname.startsWith(item.href));

  async function logout() {
    await authClient.signOut();
    toast.success("You have been logged out");
    router.replace("/");
    router.refresh();
  }

  const navList = (
    <ul className="space-y-1.5">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link href={href} onClick={() => setOpen(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                active ? "bg-berry-600 text-white shadow-soft" : "text-ink-soft hover:bg-berry-50 hover:text-berry-700"
              }`}>
              <Icon className={`h-4 w-4 ${active ? "text-gold-200" : "text-berry-400 group-hover:text-berry-600"}`} />
              <span className="flex-1">{label}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      <div className="relative overflow-hidden bg-gradient-to-br from-berry-800 to-berry-600 p-5 text-white">
        <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[24px] border-white/10" />
        <div className="relative flex items-center gap-3">
          <Avatar user={user} size="h-11 w-11" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-100">
              <Sparkles className="h-3 w-3" /> {role}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">Workspace</p>
        {navList}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-berry-100 to-transparent" />
        <Link href="/services" onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-ink-soft transition hover:bg-berry-50 hover:text-berry-700">
          <Scissors className="h-4 w-4 text-berry-400" /> Browse services
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-ink-faint" />
        </Link>
      </div>

      <div className="border-t border-berry-50 p-4">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-page py-6">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="card sticky top-[88px] overflow-hidden">{sidebarInner}</div>
        </aside>

        <div className="min-w-0">
          {/* Mobile-friendly top bar */}
          <div className="glass sticky top-[76px] z-20 mb-6 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 shadow-sm sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <button onClick={() => setOpen(true)} className="rounded-xl border border-berry-100 bg-white p-2.5 text-ink lg:hidden" aria-label="Open dashboard menu">
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Dashboard</p>
                <p className="truncate text-sm font-semibold text-ink">{current?.label || "Overview"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-700 sm:inline-flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sage-500" /> All systems good
              </span>
              <Link href="/" className="btn-ghost !px-3 !py-2 text-xs">View site</Link>
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] animate-fade-up bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-2 text-ink shadow-sm" aria-label="Close menu">
              <X className="h-4 w-4" />
            </button>
            {sidebarInner}
          </div>
        </div>
      )}
    </div>
  );
}
