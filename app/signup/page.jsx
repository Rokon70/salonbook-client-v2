"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import AuthShell, { Divider, FieldError, GoogleButton } from "@/components/AuthShell";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

function validate(f) {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = "Enter a valid email address";
  if (f.password.length < 6) errors.password = "Use at least 6 characters";
  else if (!/[A-Z]/.test(f.password)) errors.password = "Add at least one uppercase letter";
  else if (!/[a-z]/.test(f.password)) errors.password = "Add at least one lowercase letter";
  return errors;
}

function strength(p) {
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d|[^A-Za-z0-9]/.test(p)) score++;
  return score;
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  function go(target) {
    router.replace(target);
    router.refresh();
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/signup")) window.location.assign(target);
      }, 900);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const problems = validate(form);
    setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error(problems.name || problems.email || problems.password);
      return;
    }
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(), email: form.email.trim(), password: form.password, image: form.image || undefined,
    });
    setBusy(false);
    if (error) {
      if (/email/i.test(error.message || "")) setErrors((p) => ({ ...p, email: error.message }));
      toast.error(error.message || "Could not create your account");
      return;
    }
    toast.success("Account created. Welcome to SalonBook!");
    go("/dashboard");
  }

  async function google() {
    setBusy(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
    if (error) { setBusy(false); toast.error(error.message || "Google sign up failed"); }
  }

  const score = strength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["bg-berry-100", "bg-red-400", "bg-amber-400", "bg-sage-500", "bg-emerald-500"][score];

  return (
    <AuthShell
      badge="Join SalonBook"
      title="Create your account"
      subtitle="Book in seconds, track every visit and keep your details in one place."
      footer={<>Already have an account? <Link href="/signin" className="font-semibold text-berry-700 hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
            <input id="name" className={`input !pl-11 ${errors.name ? "!border-red-300 !ring-red-50" : ""}`} autoComplete="name"
              placeholder="e.g. Rahim Ahmed" value={form.name} onChange={set("name")} aria-invalid={Boolean(errors.name)} />
          </div>
          <FieldError>{errors.name}</FieldError>
        </div>

        <div>
          <label className="label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
            <input id="email" type="email" className={`input !pl-11 ${errors.email ? "!border-red-300 !ring-red-50" : ""}`} autoComplete="email"
              placeholder="you@example.com" value={form.email} onChange={set("email")} aria-invalid={Boolean(errors.email)} />
          </div>
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-berry-400" />
            <input id="password" type={showPassword ? "text" : "password"}
              className={`input !pl-11 !pr-12 ${errors.password ? "!border-red-300 !ring-red-50" : ""}`} autoComplete="new-password"
              placeholder="Create a password" value={form.password} onChange={set("password")} aria-invalid={Boolean(errors.password)} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-faint hover:bg-berry-50 hover:text-berry-700">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError>{errors.password}</FieldError>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((bar) => <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar <= score ? strengthColor : "bg-berry-50"}`} />)}
            </div>
            <span className="w-12 text-right text-[11px] font-semibold text-ink-faint">{strengthLabel}</span>
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">6+ characters, one uppercase and one lowercase letter.</p>
        </div>

        <div>
          <span className="label">Profile photo <span className="font-normal text-ink-faint">(optional)</span></span>
          <ImageUploader allowUrl round value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />
        </div>

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? <><Spinner className="h-4 w-4" /> Creating…</> : <>Create account</>}
        </button>
      </form>

      <Divider />
      <GoogleButton onClick={google} disabled={busy} />

      <p className="mt-6 flex items-start gap-2 rounded-xl bg-sage-50 p-3 text-xs leading-relaxed text-ink-soft">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-700" />
        We never share your details. You can update your profile any time from your dashboard.
      </p>
    </AuthShell>
  );
}
