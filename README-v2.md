# SalonBook v2 — redesigned client

A complete UI/UX refresh of the SalonBook client, kept in a **separate folder** so the original `salonbook-client` project is untouched.

- Folder: `salonbook-client-v2`
- Preview port: `3001` (original app keeps using `3000`)
- Stack: Next.js 15 · React 19 · Tailwind CSS 3 · Better Auth · lucide-react (no new dependencies)

## What's new

- **Home** — cinematic gradient hero, instant service search, popular tags, trust strip, curated categories and a 3-step "how it works" section.
- **Browse services** — sticky smart filter bar, category pills, debounced search, sort, active filter chips, shareable URL (`?search=&category=&sort=`), skeleton cards and a friendlier empty state.
- **Service cards / details** — consistent `4:3` image framing, hover lift, category badge, clearer price/duration, and a polished booking form with slot selection.
- **Auth** — split-layout sign in / sign up, show-hide password, inline validation, password strength hint, and a **Forgot password?** helper page.
- **Dashboard** — redesigned sidebar with role chip, sticky top bar, stat cards with accent bars, progress panel and quick links for both admin and customer.
- **Shared UI** — new colour tokens, shadows, animators, glass surfaces, better toasts, reduced-motion support and refreshed dialogs/tables/badges.

> **Forgot password note:** this v2 adds a real helper page, but one-click email reset still needs an email provider (Resend/SMTP) configured in Better Auth. The page honestly explains this and offers a prefilled support email — it does not fake a reset flow.

### Storefront lookbook

The 8 seeded services use a curated, classy editorial look in `public/lookbook/` (still images) plus subtle muted motion previews hosted by Mixkit's free video library. Hover a card on desktop or tap the small play button to preview. The mapping lives in `lib/service-media.js`, keyed by service id and name — the admin dashboard still shows the real MongoDB image, and removing a key restores the database image everywhere.

## Run locally

```bash
cd salonbook-client-v2
copy .env.example .env.local   # then fill in the real values
npm install                    # skip if node_modules is already linked
npm run dev -- -p 3001
```

Open <http://localhost:3001>.

For a local full-stack preview, also run `salonbook-server-v2` on port `5001` and keep:

```env
NEXT_PUBLIC_API_URL=/server-api
API_UPSTREAM=http://localhost:5001/api
BETTER_AUTH_URL=https://salonbook-client-gamma-three.vercel.app
BETTER_AUTH_PREVIEW_URL=http://localhost:3001
```

The browser calls the same-origin `/server-api` path and Next.js proxies it to `API_UPSTREAM`, so the server's CORS allow-list doesn't block the `3001` preview. `BETTER_AUTH_URL` stays identical to the API server's `AUTH_URL` (the deployed client URL) because that is the JWT issuer/JWKS origin the server verifies against. `BETTER_AUTH_PREVIEW_URL` only tells this v2 app to trust the `localhost:3001` browser origin. Email/password login still happens on `localhost:3001`. Google OAuth redirects go to the configured `BETTER_AUTH_URL`; production uses your own domain.

Email/password sign in works locally. Google OAuth needs `http://localhost:3001/api/auth/callback/google` added as an authorised redirect URI in Google Cloud.

## Deploy notes

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `/server-api` (same-origin proxy path) |
| `API_UPSTREAM` | `https://salonbook-server-rokon70.vercel.app/api` |
| `BETTER_AUTH_URL` | `https://your-new-client.vercel.app` |
| `CLIENT_URL` (server) | `https://your-new-client.vercel.app` |
| `AUTH_URL` (server) | `https://your-new-client.vercel.app` |

`NEXT_PUBLIC_*` must stay **Config** in Vercel, not Secret. Re-deploy after changing env vars.

## ZIP contents

`salonbook-client-v2.zip` contains the source only. Excluded on purpose:

- `node_modules` (junction to the original project — not portable)
- `.next` (build cache)
- `.env.local` (secrets — use `.env.example` instead)

The original `salonbook-client` files were **not modified** for this redesign.
