import Link from "next/link";
import { ArrowUpRight, Clock, Facebook, Instagram, Mail, MapPin, Phone, Scissors, Sparkles, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-berry-800 via-berry-700 to-berry-600 px-6 py-12 text-white shadow-lift sm:px-12">
          <div aria-hidden className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div aria-hidden className="absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-gold-400/20 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-100"><Sparkles className="h-3.5 w-3.5" /> Your glow-up starts here</span>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">Ready to feel like the best version of yourself?</h2>
              <p className="mt-2 max-w-lg text-sm text-berry-100/85">Pick a service, choose your time, and let us take care of the rest.</p>
            </div>
            <Link href="/services" className="btn bg-white px-6 text-berry-700 hover:-translate-y-0.5 hover:bg-gold-50 hover:shadow-lift">
              Explore services <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14 bg-ink text-berry-100">
        <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5 font-display text-2xl text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Scissors className="h-5 w-5 text-gold-300" /></span>
              SalonBook
            </p>
            <p className="mt-4 text-sm leading-relaxed text-berry-200/75">Hair, skin, nails and calm. Pick a service, choose a time and we will take care of the rest.</p>
            <div className="mt-5 flex gap-2.5">
              {[[Facebook, "Facebook"], [Instagram, "Instagram"], [Twitter, "Twitter"]].map(([Icon, label]) => (
                <a key={label} href="https://example.com" aria-label={label} className="rounded-full bg-white/10 p-2.5 transition hover:-translate-y-0.5 hover:bg-berry-500"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-berry-200/80">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/services" className="hover:text-white">Browse services</Link></li>
              <li><Link href="/services?category=Haircut%20%26%20Styling" className="hover:text-white">Hair styling</Link></li>
              <li><Link href="/services?category=Spa%20%26%20Massage" className="hover:text-white">Spa & massage</Link></li>
              <li><Link href="/signup" className="hover:text-white">Create an account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Visit us</h3>
            <ul className="mt-4 space-y-3 text-sm text-berry-200/80">
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />+880 1700-000000</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />hello@salonbook.com</li>
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />House 12, Road 5, Dhanmondi, Dhaka 1209</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Opening hours</h3>
            <ul className="mt-4 space-y-3 text-sm text-berry-200/80">
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /><span>Sat – Thu<br /><span className="text-white">9:00 AM – 7:00 PM</span></span></li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /><span>Friday<br /><span className="text-white">3:00 PM – 8:00 PM</span></span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-berry-200/60">
          © {new Date().getFullYear()} SalonBook. Crafted for calm, confidence and great hair.
        </div>
      </div>
    </footer>
  );
}
