"use client";
import Link from "next/link";
import {
  ArrowUpRight, CalendarCheck, CalendarClock, CalendarDays, CreditCard,
  ListChecks, Scissors, Sparkles, Users,
} from "lucide-react";
import { ErrorBox, PageLoader, StatCard } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch(() => api("/stats/admin"), []);
  if (loading) return <PageLoader label="Loading dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const pending = data.pending || 0;
  const confirmed = data.confirmed || 0;
  const total = data.total || 0;

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-berry-900 via-berry-800 to-berry-600 p-7 text-white shadow-lift sm:p-9">
        <div aria-hidden className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />
        <div aria-hidden className="absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow !border-white/20 !bg-white/10 !text-gold-100"><Sparkles className="h-3.5 w-3.5" /> Admin console</span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Everything at a glance.</h1>
            <p className="mt-2 max-w-xl text-sm text-berry-100/80">
              Keep an eye on requests, services and payments — then jump straight into what needs attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/dashboard/admin/services" className="btn bg-white text-berry-700 hover:-translate-y-0.5 hover:bg-gold-50 hover:shadow-lift">
              <Scissors className="h-4 w-4" /> Manage services
            </Link>
            <Link href="/dashboard/admin/appointments" className="btn border border-white/25 text-white hover:-translate-y-0.5 hover:bg-white/10">
              <ListChecks className="h-4 w-4" /> Appointments
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered customers" value={data.customers} icon={Users} />
        <StatCard label="Active services" value={data.services} icon={Scissors} tone="sage" />
        <StatCard label="Appointment requests" value={data.total} icon={CalendarDays} />
        <StatCard label="Pending appointments" value={data.pending} icon={CalendarClock} tone="amber" />
        <StatCard label="Confirmed appointments" value={data.confirmed} icon={CalendarCheck} tone="sage" />
        <StatCard label="Successful payments" value={data.payments} icon={CreditCard} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Today&apos;s focus</p>
              <h2 className="mt-1 text-xl font-semibold">{pending ? `${pending} request${pending === 1 ? "" : "s"} waiting` : "All caught up"}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {pending ? "Review and confirm pending bookings so clients can pay on time." : "No pending requests right now. Nice work!"}
              </p>
            </div>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${pending ? "bg-amber-50 text-amber-600" : "bg-sage-50 text-sage-700"}`}>
              <CalendarClock className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-berry-50">
            <div className="h-full rounded-full bg-gradient-to-r from-berry-500 to-berry-300 transition-all duration-700"
              style={{ width: `${total ? Math.max(8, Math.round((confirmed / total) * 100)) : 0}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
            <span>{confirmed} confirmed of {total} total</span>
            <Link href="/dashboard/admin/appointments" className="inline-flex items-center gap-1 font-semibold text-berry-700 hover:gap-2">
              Review <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Quick links</p>
          <h2 className="mt-1 text-xl font-semibold">Jump back in</h2>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[
              [Scissors, "Service menu", "/dashboard/admin/services"],
              [Users, "Customers", "/dashboard/admin/users"],
              [CreditCard, "Transactions", "/dashboard/admin/transactions"],
              [CalendarDays, "Appointments", "/dashboard/admin/appointments"],
            ].map(([Icon, label, href]) => (
              <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl border border-berry-50 bg-cream p-3.5 transition hover:-translate-y-0.5 hover:border-berry-200 hover:bg-white hover:shadow-soft">
                <span className="rounded-lg bg-white p-2 text-berry-600 shadow-sm"><Icon className="h-4 w-4" /></span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-berry-300 transition group-hover:text-berry-600" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
