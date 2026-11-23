"use client";
import { useEffect } from "react";
import { Loader2, X, AlertCircle, Inbox } from "lucide-react";

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-soft" role="status">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-berry-50">
        <Spinner className="h-6 w-6 text-berry-600" />
        <span className="absolute inset-0 animate-ping rounded-2xl bg-berry-100/60" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="mx-auto my-10 max-w-md rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-soft">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600"><AlertCircle className="h-6 w-6" /></span>
      <p className="mt-3 text-sm font-medium text-red-800">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-outline btn-sm mt-5">Try again</button>}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-berry-200 bg-white/70 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-berry-50 text-berry-400"><Inbox className="h-7 w-7" /></span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

const BADGES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sage-100 text-sage-700",
  cancelled: "bg-red-100 text-red-700",
  unpaid: "bg-slate-100 text-slate-700",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-700",
  active: "bg-sage-100 text-sage-700",
  inactive: "bg-slate-100 text-slate-600",
  blocked: "bg-red-100 text-red-700",
};

export function StatusBadge({ value }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BADGES[value] || "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "berry" }) {
  const tones = {
    berry: { wrap: "from-berry-100 to-berry-50", icon: "text-berry-600", bar: "bg-berry-500" },
    sage: { wrap: "from-sage-100 to-sage-50", icon: "text-sage-700", bar: "bg-sage-500" },
    amber: { wrap: "from-amber-100 to-amber-50", icon: "text-amber-700", bar: "bg-amber-400" },
    red: { wrap: "from-red-100 to-red-50", icon: "text-red-600", bar: "bg-red-400" },
  };
  const t = tones[tone] || tones.berry;
  return (
    <div className="card-hover group relative overflow-hidden p-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${t.bar} opacity-0 transition-opacity group-hover:opacity-100`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold leading-none">{value ?? 0}</p>
        </div>
        {Icon && (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.wrap} ${t.icon} transition-transform group-hover:-rotate-6`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-berry-50">
        <div className={`h-full w-1/3 rounded-full ${t.bar} opacity-60 transition-all duration-500 group-hover:w-2/3 group-hover:opacity-100`} />
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-faint hover:bg-berry-50"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmText = "Confirm", danger, busy, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={busy ? () => {} : onClose}>
      <p className="text-sm text-ink-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-outline" onClick={onClose} disabled={busy}>Keep it</button>
        <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={busy}>
          {busy && <Spinner className="h-4 w-4" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function Field({ label, children }) {
  return <div><span className="label">{label}</span>{children}</div>;
}

export function DetailRow({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-berry-50 py-2 text-sm last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}
