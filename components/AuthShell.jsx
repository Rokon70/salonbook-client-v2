import Link from "next/link";
import { ArrowUpRight, CalendarCheck, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function AuthShell({ title, subtitle, children, footer, badge }) {
  return (
    <div className="container-page flex min-h-[78vh] items-center py-10 sm:py-14">
      <div className="grid w-full overflow-hidden rounded-3xl border border-berry-100 bg-white shadow-lift lg:grid-cols-[1.05fr_1fr]">
        {/* Brand / reassurance panel */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-berry-900 via-berry-800 to-berry-600 p-12 text-white lg:flex lg:flex-col">
          <div aria-hidden className="absolute -left-20 -top-24 h-80 w-80 rounded-full border-[48px] border-white/5" />
          <div aria-hidden className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl" />
          <Link href="/" className="relative flex items-center gap-2.5 font-display text-2xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Sparkles className="h-5 w-5 text-gold-300" /></span>
            Salon<span className="text-gold-300">Book</span>
          </Link>

          <div className="relative my-auto max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-100">
              <Star className="h-3.5 w-3.5 fill-current" /> Loved by 2,000+ clients
            </span>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">Your best hair days start with one small click.</h2>
            <p className="mt-4 text-sm leading-relaxed text-berry-100/80">
              Book trusted stylists, manage your visits and pay securely — all in one calm little place.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-3">
              {[
                [CalendarCheck, "Easy booking", "Request a slot anytime"],
                [ShieldCheck, "Safe payments", "Pay after confirmation"],
              ].map(([Icon, label, text]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-gold-300" />
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-berry-100/70">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-3 text-xs text-berry-100/70">
            <span className="flex -space-x-2">
              {["A", "S", "R"].map((c) => (
                <span key={c} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold ring-2 ring-berry-800">{c}</span>
              ))}
            </span>
            Booked, confirmed and smiling since 2024
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </aside>

        {/* Form panel */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14">
          <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl text-berry-700 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-berry-600 text-white"><Sparkles className="h-4 w-4" /></span>
            SalonBook
          </Link>

          {badge && <span className="eyebrow mb-4 w-fit">{badge}</span>}
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && (
            <p className="mt-8 border-t border-berry-50 pt-6 text-center text-sm text-ink-soft">{footer}</p>
          )}
        </section>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-outline w-full">
      <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
        <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
      <span className="h-px flex-1 bg-berry-100" /> or continue with <span className="h-px flex-1 bg-berry-100" />
    </div>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600" role="alert">{children}</p>;
}
