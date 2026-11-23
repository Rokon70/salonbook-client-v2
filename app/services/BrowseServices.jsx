"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { EmptyState, ErrorBox } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";

function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton mt-5 h-9 w-full" />
      </div>
    </div>
  );
}

export default function BrowseServices() {
  const params = useSearchParams();
  const urlSearch = params.get("search") || "";
  const urlCategory = params.get("category") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debounced, setDebounced] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("");

  // Keep the UI in sync when someone lands from the hero / a footer link.
  useEffect(() => { setSearch(urlSearch); setDebounced(urlSearch); }, [urlSearch]);
  useEffect(() => { setCategory(urlCategory); }, [urlCategory]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Shareable URL without a Next.js navigation round-trip.
  useEffect(() => {
    const q = new URLSearchParams();
    if (debounced) q.set("search", debounced);
    if (category) q.set("category", category);
    if (sort) q.set("sort", sort);
    const next = `/services${q.size ? `?${q}` : ""}`;
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [debounced, category, sort]);

  const { data, loading, error, reload } = useFetch(() => {
    const q = new URLSearchParams({ limit: "50" });
    if (debounced) q.set("search", debounced);
    if (category) q.set("category", category);
    if (sort) q.set("sort", sort);
    return api(`/services?${q}`, { auth: false });
  }, [debounced, category, sort]);

  const hasFilters = Boolean(debounced || category || sort);
  const activeCount = [debounced, category, sort].filter(Boolean).length;
  const results = data?.services || [];
  const total = data?.total ?? results.length;

  const chips = useMemo(() => [
    debounced && { label: `“${debounced}”`, clear: () => setSearch("") },
    category && { label: category, clear: () => setCategory("") },
    sort && { label: sort === "price_asc" ? "Price: low to high" : "Price: high to low", clear: () => setSort("") },
  ].filter(Boolean), [debounced, category, sort]);

  const reset = () => { setSearch(""); setDebounced(""); setCategory(""); setSort(""); };

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-berry-800 to-berry-600 px-6 py-10 text-white shadow-lift sm:px-10">
        <div aria-hidden className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
        <div aria-hidden className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
        <div className="relative">
          <span className="eyebrow !border-white/20 !bg-white/10 !text-gold-100"><Sparkles className="h-3.5 w-3.5" /> The full menu</span>
          <h1 className="section-title mt-3 !text-white">Find your next favourite treatment</h1>
          <p className="mt-2 max-w-xl text-sm text-berry-100/85 sm:text-base">
            Search by name, browse by category, or sort by price. Every booking starts right here.
          </p>
        </div>
      </div>

      {/* Sticky smart filter bar */}
      <div className="sticky top-[72px] z-30 -mx-4 mt-6 px-4 pt-2 sm:-mx-6 sm:px-6">
        <div className="glass rounded-2xl p-3 shadow-soft sm:p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_210px_190px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
              <input
                className="input !pl-11 !pr-10"
                placeholder="Search e.g. balayage, facial, manicure…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search services"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-faint hover:bg-berry-50 hover:text-berry-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
              <select className="input !pl-11" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort services">
              <option value="">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
            <button
              onClick={reset}
              disabled={!hasFilters}
              className="btn-outline justify-center disabled:opacity-40 disabled:hover:translate-y-0"
              title="Clear all filters"
            >
              <RotateCcw className="h-4 w-4" /> Clear{activeCount ? ` (${activeCount})` : ""}
            </button>
          </div>

          {/* Category pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button onClick={() => setCategory("")}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${!category ? "bg-berry-600 text-white shadow-soft" : "bg-white text-ink-soft ring-1 ring-berry-100 hover:bg-berry-50 hover:text-berry-700"}`}>
              All services
            </button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(category === c ? "" : c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${category === c ? "bg-berry-600 text-white shadow-soft" : "bg-white text-ink-soft ring-1 ring-berry-100 hover:bg-berry-50 hover:text-berry-700"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter chips + result count */}
      {chips.length > 0 && !loading && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button key={chip.label} onClick={chip.clear} className="inline-flex items-center gap-1.5 rounded-full bg-berry-50 px-3 py-1.5 text-xs font-medium text-berry-700 ring-1 ring-berry-100 hover:bg-berry-100">
              {chip.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button onClick={reset} className="text-xs font-semibold text-ink-faint underline-offset-2 hover:text-berry-700 hover:underline">Reset all</button>
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <>
            <div className="skeleton mb-6 h-4 w-40" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </>
        ) : error ? (
          <ErrorBox message={error} onRetry={reload} />
        ) : results.length === 0 ? (
          <EmptyState
            title="No services match those filters"
            text="Try a different keyword or clear the filters to see everything we offer."
            action={<button onClick={reset} className="btn-primary"><RotateCcw className="h-4 w-4" /> Clear filters</button>}
          />
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-ink-soft">
                Showing <span className="font-semibold text-ink">{results.length}</span> of {total} {total === 1 ? "service" : "services"}
              </p>
              <span className="hidden items-center gap-1.5 text-xs font-medium text-sage-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-sage-500" /> Available to book
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm text-ink-soft">Not sure what to pick?</p>
              <a href="mailto:hello@salonbook.com" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-berry-700 hover:gap-2.5">
                Ask our stylists <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
