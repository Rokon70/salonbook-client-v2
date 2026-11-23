"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import AuthShell, { FieldError } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = /^\S+@\S+\.\S+$/.test(email.trim());
  const mailto = `mailto:hello@salonbook.com?subject=${encodeURIComponent("SalonBook password reset request")}&body=${encodeURIComponent(
    `Hello SalonBook team,\n\nPlease help me reset the password for: ${email.trim() || "[your email]"}\n\nThank you.`
  )}`;

  return (
    <AuthShell
      badge="Account help"
      title="Forgot your password?"
      subtitle="Automatic reset emails aren’t enabled in this demo yet — but we can still get you back in."
      footer={<>Remembered it? <Link href="/signin" className="font-semibold text-berry-700 hover:underline">Back to sign in</Link></>}
    >
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-900">
        <p className="flex items-start gap-2 font-semibold">
          <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0" /> Manual reset for now
        </p>
        <p className="mt-2 leading-relaxed text-amber-800/90">
          Send us the email you use for SalonBook. An admin will verify your account and share a safe reset instruction.
          No password is ever sent by email.
        </p>
      </div>

      <div className="mt-6">
        <label className="label" htmlFor="reset-email">Your account email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
          <input
            id="reset-email" type="email" className={`input !pl-11 ${touched && !valid ? "!border-red-300 !ring-red-50" : ""}`}
            placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)}
          />
        </div>
        <FieldError>{touched && !valid ? "Enter a valid email address" : ""}</FieldError>
      </div>

      <a
        href={mailto}
        onClick={() => setTouched(true)}
        aria-disabled={!valid}
        className={`btn-primary mt-4 w-full ${!valid ? "pointer-events-none opacity-50" : ""}`}
      >
        <Mail className="h-4 w-4" /> Email support
      </a>

      <Link href="/signin" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-berry-700">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>

      <p className="mt-6 flex items-start gap-2 border-t border-berry-50 pt-5 text-xs leading-relaxed text-ink-faint">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-700" />
        To enable one-click reset links later, connect an email provider (Resend / SMTP) and turn on Better Auth password reset.
      </p>
    </AuthShell>
  );
}
