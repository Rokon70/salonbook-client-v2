"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, ChevronDown, LayoutDashboard, LogOut, Menu, Scissors, Sparkles, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const user = session?.user;

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function logout() {
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
  }

  const link = (href, label) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link key={href} href={href}
        className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-berry-700" : "text-ink-soft hover:text-berry-700"}`}>
        {label}
        {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-berry-500" />}
      </Link>
    );
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-berry-100/80 bg-white/85 shadow-sm backdrop-blur-xl" : "border-b border-transparent bg-cream/70 backdrop-blur"}`}>
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-berry-600 to-berry-400 text-white shadow-soft transition-transform group-hover:-rotate-6">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">Salon<span className="text-berry-600">Book</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {link("/", "Home")}
          {link("/services", "Services")}
          {user && link("/dashboard", "Dashboard")}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-berry-50" />
          ) : user ? (
            <div className="relative" ref={ref}>
              <button onClick={() => setMenu(!menu)} className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 transition hover:shadow-soft" aria-expanded={menu}>
                <Avatar user={user} />
                <span className="max-w-[110px] truncate text-sm font-semibold">{user.name}</span>
                <ChevronDown className={`h-4 w-4 text-ink-faint transition-transform ${menu ? "rotate-180" : ""}`} />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-60 animate-fade-up overflow-hidden rounded-2xl border border-berry-100 bg-white p-2 shadow-lift">
                  <div className="flex items-center gap-3 rounded-xl bg-berry-50/70 p-3">
                    <Avatar user={user} size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-ink-faint">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-berry-50 hover:text-berry-700"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                  <Link href="/dashboard/customer/appointments" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-berry-50 hover:text-berry-700"><CalendarCheck className="h-4 w-4" />My appointments</Link>
                  <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn-ghost">Sign In</Link>
              <Link href="/signup" className="btn-primary !px-5 !py-2.5"><Sparkles className="h-4 w-4" />Get started</Link>
            </>
          )}
        </div>

        <button className="rounded-xl border border-berry-100 bg-white p-2.5 text-ink md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-berry-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {link("/", "Home")}
            {link("/services", "Browse Services")}
            {user ? (
              <>
                {link("/dashboard", "Dashboard")}
                <div className="my-2 divider-soft" />
                <p className="px-4 text-xs text-ink-faint">Signed in as <span className="font-semibold text-ink">{user.name}</span></p>
                <button onClick={logout} className="btn-outline mt-2"><LogOut className="h-4 w-4" />Logout</button>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link href="/signin" className="btn-outline">Sign In</Link>
                <Link href="/signup" className="btn-primary">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Avatar({ user, size = "h-8 w-8" }) {
  return user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white`} referrerPolicy="no-referrer" />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-berry-500 to-berry-700 text-sm font-semibold text-white ring-2 ring-white`}>
      {user?.name?.[0]?.toUpperCase() || "?"}
    </span>
  );
}
