# Deploying Cosmetics Batch on Coolify + Contabo VPS

Self-hosted deploy via Docker. The app builds to a Next.js **standalone** server
(`output: "standalone"`), shipped by the multi-stage `Dockerfile`.

## 1. Server (Contabo VPS)

1. Provision the VPS (Ubuntu 22.04/24.04). SSH in as root.
2. Install Coolify:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
3. Open the Coolify dashboard at `http://<vps-ip>:8000` and finish setup.
4. Point your domain's DNS **A record** at the VPS IP.

## 2. Git

Coolify deploys from a Git repo. If this project isn't one yet:
```bash
git init && git add -A && git commit -m "Initial commit"
git remote add origin <your-repo-url> && git push -u origin main
```

## 3. Coolify application

- **New Resource → Application → Public/Private Repository.**
- **Build Pack: `Dockerfile`** (auto-detected). Nothing else to configure — the
  Dockerfile handles install/build/run.
- **Port (Ports Exposes): `3000`.**
- **Health Check Path: `/`** (returns 200 — English home, no redirect).

### Environment variables

`NEXT_PUBLIC_*` values are **inlined at build time**, so in Coolify mark them as
**Build Variables** (not just runtime). Set at minimum:

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://cosmeticsbatch.com` | **Required.** Canonical/OG/sitemap/hreflang. No trailing slash. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` | Optional. Blank = ad placeholders, `ads.txt` returns 204. |
| `NEXT_PUBLIC_ADSENSE_SLOT_HOME` | `1234567890` | Optional. |
| `NEXT_PUBLIC_ADSENSE_SLOT_RESULT` | `1234567890` | Optional. |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE` | `1234567890` | Optional. |
| `NEXT_PUBLIC_ADSENSE_SLOT_BRAND` | `1234567890` | Optional. |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Optional. Google Analytics 4 measurement ID. Blank = no analytics, no cookies. |
| `NEXT_PUBLIC_YM_ID` | `110450605` | Optional. Yandex Metrica counter id. Loads only after cookie consent. Blank = off. |

> Changing any `NEXT_PUBLIC_*` requires a **rebuild** (they are baked into the
> build), not just a restart.

### Domain & SSL

Set the domain (e.g. `https://cosmeticsbatch.com`) in Coolify → it provisions a free
Let's Encrypt certificate automatically. Use the same value for `NEXT_PUBLIC_SITE_URL`.

## 4. Deploy

Hit **Deploy**. Coolify builds the image and starts the container. Visit the domain.

## Notes

- **Languages:** only the default locale (English, prebuilt as `/en`) is
  generated at build time. Other locales (`/es`, `/fr`, `/ar`, …) render on the
  first request and are then cached — this keeps build time and image size flat
  regardless of how many languages are active. To add more languages, run
  `scripts/translate.mjs` and add the code to `ACTIVE` in `src/i18n/locales.ts`.
- **Persisting the render cache (optional):** to keep on-demand locale pages
  cached across restarts, add a Coolify **Persistent Storage** volume mounted at
  `/app/.next/cache`.
- **Resources:** the image is small (standalone). ~1 vCPU / 1–2 GB RAM is plenty
  for this static-heavy site; Contabo VPS 10 is comfortably over-spec.
- **Redeploys:** push to the tracked branch; enable Coolify's webhook/auto-deploy
  to build on push.

## Local Docker test (optional)

```bash
docker build -t cosmeticsbatch --build-arg NEXT_PUBLIC_SITE_URL=https://cosmeticsbatch.com .
docker run -p 3000:3000 cosmeticsbatch
# open http://localhost:3000  (English home; /fr, /ar, … for other languages)
```
