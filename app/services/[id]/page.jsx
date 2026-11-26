"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarPlus, Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import { ErrorBox, PageLoader, Spinner } from "@/components/ui";
import ServiceMedia from "@/components/ServiceMedia";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { money } from "@/lib/utils";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useFetch(() => api(`/services/${id}`), [id]);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <PageLoader label="Loading service…" />;
  if (error) return (
    <div className="container-page py-10">
      <ErrorBox message={error} onRetry={reload} />
      <div className="text-center"><Link href="/services" className="btn-outline"><ArrowLeft className="h-4 w-4" /> Back to services</Link></div>
    </div>
  );

  const s = data.service;
  const isAdmin = session?.user?.role === "admin";
  const bookable = s.status === "active";

  return (
    <div className="container-page py-8 sm:py-12">
      <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-berry-700">
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Editorial image with subtle motion preview */}
        <ServiceMedia
          service={s}
          category={s.category}
          className="aspect-[4/3] w-full rounded-3xl shadow-lift ring-1 ring-berry-100"
        />

        {/* Details */}
        <div className="flex flex-col">
          <span className="eyebrow w-fit">SalonBook service</span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">{s.serviceName}</h1>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{s.description}</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-berry-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">Price</p>
              <p className="mt-1 font-display text-2xl font-semibold text-berry-700">{money(s.price)}</p>
            </div>
            <div className="rounded-2xl border border-berry-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">Duration</p>
              <p className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">
                <Clock className="h-5 w-5 text-berry-400" />{s.duration} min
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-sage-50 p-3.5 text-xs leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
            Request now, pay securely only after the salon confirms your appointment.
          </div>

          {!bookable && (
            <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              This service is inactive and cannot be booked right now.
            </p>
          )}
          {isAdmin && (
            <p className="mt-5 flex gap-2.5 rounded-xl border border-berry-100 bg-berry-50 p-4 text-sm text-berry-800">
              <ShieldAlert className="h-5 w-5 shrink-0" /> Admins can manage services here but can&apos;t submit customer booking requests.
            </p>
          )}

          {bookable && !isAdmin && !showForm && (
            <button className="btn-primary mt-6 w-full sm:w-auto" onClick={() => setShowForm(true)}>
              <CalendarPlus className="h-4 w-4" /> Book appointment
            </button>
          )}
          {bookable && !isAdmin && showForm && (
            <BookingForm serviceId={s._id} onDone={() => router.push("/dashboard/customer/appointments")} />
          )}
        </div>
      </div>
    </div>
  );
}

function BookingForm({ serviceId, onDone }) {
  // Local date (toISOString() is UTC and can be a day off in other timezones)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const slots = useFetch(() => (date ? api(`/appointments/slots?serviceId=${serviceId}&date=${date}`) : Promise.resolve(null)), [date, serviceId]);

  async function submit(e) {
    e.preventDefault();
    if (!date) return toast.error("Choose an appointment date");
    if (!slot) return toast.error("Choose a time slot");
    setBusy(true);
    try {
      const res = await api("/appointments", { method: "POST", body: { serviceId, appointmentDate: date, timeSlot: slot, message } });
      toast.success(res.message);
      onDone();
    } catch (err) {
      toast.error(err.message);
      slots.reload();
      setSlot("");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="card mt-6 space-y-5 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-berry-50 text-berry-600"><CalendarPlus className="h-5 w-5" /></span>
        <div>
          <h2 className="text-xl font-semibold">Request an appointment</h2>
          <p className="text-xs text-ink-faint">Pick a date and an available slot.</p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="date">Appointment date</label>
        <input id="date" type="date" min={today} className="input" value={date} onChange={(e) => { setDate(e.target.value); setSlot(""); }} />
      </div>

      <div>
        <span className="label">Available time slot</span>
        {!date ? (
          <p className="rounded-xl border border-dashed border-berry-200 bg-cream px-4 py-5 text-center text-sm text-ink-faint">Pick a date to see time slots.</p>
        ) : slots.loading || (!slots.data && !slots.error) ? (
          <div className="flex items-center gap-2 text-sm text-ink-soft"><Spinner className="h-4 w-4 text-berry-600" /> Checking slots…</div>
        ) : slots.error ? (
          <p className="text-sm text-red-600">{slots.error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.data.slots.map((t) => {
              const taken = slots.data.taken.includes(t);
              return (
                <button type="button" key={t} disabled={taken} onClick={() => setSlot(t)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                    taken ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 line-through"
                      : slot === t ? "border-berry-600 bg-berry-600 text-white shadow-soft"
                      : "border-berry-100 bg-white text-ink-soft hover:border-berry-300 hover:bg-berry-50"
                  }`}>
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="label" htmlFor="msg">Additional message <span className="font-normal text-ink-faint">(optional)</span></label>
        <textarea id="msg" rows={3} maxLength={500} className="input resize-none" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything we should know?" />
      </div>

      <button className="btn-primary w-full" disabled={busy}>
        {busy ? <><Spinner className="h-4 w-4" /> Sending…</> : <>Submit request</>}
      </button>
    </form>
  );
}
