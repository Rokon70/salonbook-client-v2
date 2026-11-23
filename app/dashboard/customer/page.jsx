"use client";
import Link from "next/link";
import {
  ArrowUpRight, CalendarCheck, CalendarClock, CalendarDays, CalendarX,
  CreditCard, Scissors, Sparkles,
} from "lucide-react";
import { ErrorBox, PageLoader, StatCard } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useFetch(() => api("/stats/customer"), []);
  if (loading) return <PageLoader label="Loading your dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const pending = data.pending || 0;

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-berry-900 via-berry-800 to-berry-600 p-7 text-white shadow-lift sm:p-9">
        <div aria-hidden className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />
        <div aria-hidden className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow !border-white/20 !bg-white/10 !text-gold-100"><Sparkles className="h-3.5 w-3.5" /> Your space</span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Your bookings, all in one place.</h1>
            <p className="mt-2 max-w-xl text-sm text-berry-100/80">
              Track requests, see what&apos;s confirmed and get ready for your next visit — no hunting through emails.
            </p>
          </div>
          <Link href="/services" className="btn bg-white text-berry-700 hover:-translate-y-0.5 hover:bg-gold-50 hover:shadow-lift">
            <Scissors className="h-4 w-4" /> Book a service
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={data.total} icon={CalendarDays} />
        <StatCard label="Pending" value={data.pending} icon={CalendarClock} tone="amber" />
        <StatCard label="Confirmed" value={data.confirmed} icon={CalendarCheck} tone="sage" />
        <StatCard label="Cancelled" value={data.cancelled} icon={CalendarX} tone="red" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Next step</p>
              <h2 className="mt-1 text-xl font-semibold">{pending ? `${pending} request${pending === 1 ? "" : "s"} in review` : "Ready when you are"}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {pending
                  ? "The salon is confirming your slot. We'll show it here as soon as it's approved."
                  : "Browse the menu, choose a time, and send your request in seconds."}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-berry-50 text-berry-600">
              <CalendarClock className="h-5 w-5" />
            </span>
          </div>
          <Link href="/dashboard/customer/appointments" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-berry-700 hover:gap-3">
            View my appointments <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="card relative overflow-hidden p-6">
          <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sage-50" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Good to know</p>
            <h2 className="mt-1 text-xl font-semibold">Pay only after confirmation</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Once the salon confirms your appointment, a secure Stripe payment link appears in your payment history.
            </p>
            <Link href="/dashboard/customer/payments" className="btn-outline btn-sm mt-5">
              <CreditCard className="h-4 w-4" /> View payment history
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
