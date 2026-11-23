"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, CalendarCheck, CreditCard, Droplets, Flower2, Hand,
  Paintbrush, Search, Scissors, ShieldCheck, Smile, Sparkles, Clock3, ClipboardCheck,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { ErrorBox, PageLoader } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

const HERO = "/lookbook/hero.jpg";
const ICONS = {
  "Haircut & Styling": Scissors, "Hair Coloring": Paintbrush, "Hair Treatment": Droplets,
  "Facial & Skincare": Smile, "Makeup": Sparkles, "Manicure & Pedicure": Hand, "Spa & Massage": Flower2,
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const featured = useFetch(() => api("/services?limit=6", { auth: false }), []);
  const cats = useFetch(() => api("/services/categories", { auth: false }), []);
  const categories = cats.data?.categories || Object.keys(ICONS).map((name) => ({ name, count: null }));

  const search = (e) => {
    e.preventDefault();
    router.push(query.trim() ? `/services?search=${encodeURIComponent(query.trim())}` : "/services");
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-berry-900 via-berry-800 to-berry-600 px-6 py-14 text-white shadow-lift sm:px-12 sm:py-20">
            <div aria-hidden className="absolute inset-0 opacity-35">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO} alt="" className="h-full w-full object-cover" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-berry-900 via-berry-900/85 to-berry-700/20" />
            <div aria-hidden className="absolute -right-20 -top-28 h-96 w-96 rounded-full border-[48px] border-white/5" />
            <div aria-hidden className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="animate-fade-up">
                <span className="eyebrow !border-white/20 !bg-white/10 !text-gold-100"><Sparkles className="h-3.5 w-3.5" /> Salon booking, reimagined</span>
                <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] sm:text-6xl">
                  Look good. <span className="text-gold-300">Feel even better.</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-berry-100/85 sm:text-lg">
                  Explore expert-led hair, skin and spa treatments. Choose your time, request in seconds, and pay securely once confirmed.
                </p>

                <form onSubmit={search} className="glass mt-8 flex max-w-xl items-center gap-2 rounded-2xl p-2 shadow-lift">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-berry-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try “balayage” or “facial”…"
                    aria-label="Search services"
                    className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                  <button type="submit" className="btn-primary shrink-0 !rounded-xl !px-5 !py-2.5">Search</button>
                </form>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-berry-100/80">
                  <span>Popular:</span>
                  {["Haircut", "Balayage", "Facial", "Manicure"].map((tag) => (
                    <Link key={tag} href={`/services?search=${encodeURIComponent(tag)}`} className="rounded-full border border-white/25 px-3 py-1 transition hover:border-gold-300 hover:bg-white/10 hover:text-white">{tag}</Link>
                  ))}
                </div>
              </div>

              <div className="relative hidden animate-fade-up lg:block">
                <div className="float ml-auto max-w-sm rounded-3xl border border-white/30 bg-white/95 p-6 text-ink shadow-lift backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow !text-berry-600">This week at SalonBook</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-500"><Sparkles className="h-4 w-4" /></span>
                  </div>
                  <p className="mt-5 font-display text-2xl leading-snug">A little me-time goes a long way.</p>
                  <div className="mt-5 space-y-3">
                    {[
                      [Scissors, "Signature Haircut", "from $45"],
                      [Sparkles, "Bridal Makeup", "from $120"],
                      [Flower2, "Aromatherapy Massage", "from $90"],
                    ].map(([Icon, name, price]) => (
                      <div key={name} className="flex items-center gap-3 rounded-xl bg-cream p-3">
                        <span className="rounded-lg bg-berry-50 p-2 text-berry-600"><Icon className="h-4 w-4" /></span>
                        <span className="flex-1 text-sm font-medium">{name}</span>
                        <span className="text-xs font-semibold text-berry-600">{price}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/services" className="mt-5 flex items-center gap-2 text-sm font-semibold text-berry-700 hover:gap-3">See the full menu <ArrowRight className="h-4 w-4" /></Link>
                </div>
                <div aria-hidden className="absolute -left-8 top-6 h-24 w-24 rounded-2xl bg-gold-300/70 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="container-page mt-10">
        <div className="grid gap-3 rounded-2xl border border-berry-100 bg-white/70 p-4 text-center backdrop-blur sm:grid-cols-4">
          {[
            [ClipboardCheck, "Request in seconds"],
            [BadgeCheck, "Confirmed by the salon"],
            [ShieldCheck, "Secure Stripe checkout"],
            [Clock3, "Flexible time slots"],
          ].map(([Icon, label]) => (
            <div key={label} className="flex items-center justify-center gap-2.5 px-2 py-2 text-sm font-medium text-ink-soft">
              <Icon className="h-5 w-5 shrink-0 text-berry-500" />{label}
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="container-page mt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Curated for you</span>
            <h2 className="section-title mt-3">Featured services</h2>
            <p className="mt-2 text-ink-soft">A few favourites from our menu — handpicked for a good reason.</p>
          </div>
          <Link href="/services" className="btn-outline">View all services <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {featured.loading ? <PageLoader label="Loading services…" /> : featured.error ? (
          <ErrorBox message={featured.error} onRetry={featured.reload} />
        ) : featured.data.services.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-berry-200 bg-white p-10 text-center text-ink-soft">No services are available yet. Please check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container-page mt-24">
        <div className="text-center">
          <span className="eyebrow">Explore by category</span>
          <h2 className="section-title mt-3">What are you in the mood for?</h2>
          <p className="mt-2 text-ink-soft">Choose what you need — we will show you the rest.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => {
            const Icon = ICONS[c.name] || Scissors;
            return (
              <Link key={c.name} href={`/services?category=${encodeURIComponent(c.name)}`}
                className="card-hover group relative overflow-hidden p-6">
                <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-berry-50 transition-transform duration-500 group-hover:scale-150" />
                <span className="relative inline-flex rounded-xl bg-gradient-to-br from-berry-100 to-berry-50 p-3 text-berry-600 shadow-sm transition-transform group-hover:-rotate-6">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="relative mt-5 font-semibold leading-snug">{c.name}</p>
                {c.count !== null && <p className="relative mt-1 text-xs text-ink-faint">{c.count} {c.count === 1 ? "service" : "services"}</p>}
                <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-berry-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-sage-50 p-8 sm:p-14">
          <div aria-hidden className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sage-100/70 blur-2xl" />
          <div className="relative">
            <div className="text-center">
              <span className="eyebrow !text-sage-700">Simple by design</span>
              <h2 className="section-title mt-3">Three steps to your next appointment</h2>
            </div>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
              <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-sage-100 md:block" />
              {[
                [ClipboardCheck, "Request a time", "Pick a service, a date and a slot. Your request starts as pending."],
                [CalendarCheck, "We confirm it", "The salon reviews and confirms your request — usually within hours."],
                [CreditCard, "Pay securely", "Pay online with Stripe only after your appointment is confirmed."],
              ].map(([Icon, title, text], i) => (
                <li key={title} className="relative flex gap-4">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sage-700 shadow-soft"><Icon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Step {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
