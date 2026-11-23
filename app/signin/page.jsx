"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell, { Divider, FieldError, GoogleButton } from "@/components/AuthShell";
import { Spinner } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const nextPath = () => {
  if (typeof window === "undefined") return "/dashboard";
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
};

function validate({ email, password }) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Enter your password";
  return errors;
}

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  function go(target) {
    router.replace(target);
    router.refresh();
    // Full navigation fallback: prevents ever appearing "stuck" on the auth page.
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/signin")) window.location.assign(target);
      }, 900);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const problems = validate(form);
    setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error(problems.email || problems.password);
      return;
    }
    setBusy(true);
    const { error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    setBusy(false);
    if (error) {
      setErrors({ password: error.message || "Incorrect email or password" });
      toast.error(error.message || "Incorrect email or password");
      return;
    }
    toast.success("Welcome back!");
    go(nextPath());
  }

  async function google() {
    setBusy(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: nextPath() });
    if (error) { setBusy(false); toast.error(error.message || "Google sign in failed"); }
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to SalonBook"
      subtitle="Pick up right where you left off — your appointments are waiting."
      footer={<>New here? <Link href="/signup" className="font-semibold text-berry-700 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
            <input
              id="email" type="email" className={`input !pl-11 ${errors.email ? "!border-red-300 !ring-red-50" : ""}`}
              autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          <div id="email-error"><FieldError>{errors.email}</FieldError></div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="label" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-semibold text-berry-700 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
            <input
              id="password" type={showPassword ? "text" : "password"}
              className={`input !pl-11 !pr-12 ${errors.password ? "!border-red-300 !ring-red-50" : ""}`}
              autoComplete="current-password" placeholder="Your password" value={form.password} onChange={set("password")}
              aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-faint hover:bg-berry-50 hover:text-berry-700">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div id="password-error"><FieldError>{errors.password}</FieldError></div>
        </div>

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? <><Spinner className="h-4 w-4" /> Signing in…</> : <>Sign in</>}
        </button>
      </form>

      <Divider />
      <GoogleButton onClick={google} disabled={busy} />

      <p className="mt-6 flex items-start gap-2 rounded-xl bg-cream p-3 text-xs leading-relaxed text-ink-faint">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-berry-400" />
        Trouble signing in? Double-check your email, or contact the salon if your account is blocked.
      </p>
    </AuthShell>
  );
}
