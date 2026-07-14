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

`NEXT_PUBLIC_*` values are **inlined at build time**, so they must reach `docker
build` as `--build-arg` — setting them as runtime env has no effect at all. On
the VPS they live in `/opt/cosmeticsbatch/.env.build` (untracked; copy
`.env.build.example`), which `deploy.sh` reads and turns into build args. The
GitHub Actions workflow calls that same script, so both deploy paths bake in the
identical set. In Coolify, mark them as **Build Variables** instead.

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
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `abc…` | Optional. Renders the Search Console ownership `<meta>`. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | `abc…` | Optional. Renders the Bing Webmaster ownership `<meta>`. |

> Changing any `NEXT_PUBLIC_*` requires a **rebuild** (they are baked into the
> build), not just a restart. Adding a *new* one means adding an `ARG`/`ENV` pair
> in the Dockerfile **and** the name to the loop in `deploy.sh` — otherwise it is
> silently empty in production.

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

## User-check dataset (persistent volume)

Every batch-code check is appended as one JSON line to
`$DATASET_DIR/checks-YYYY-MM.jsonl` (`src/lib/dataset.ts`; no IP stored, only a
coarse `cf-ipcountry`). The container is rebuilt on every deploy, so this dir
**must** be a bind-mounted host volume or the data is lost.

`deploy.sh` creates the volume, sets its owner and passes `DATASET_DIR`, so a
normal deploy needs nothing extra. The equivalent by hand:

```bash
mkdir -p /opt/cosmeticsbatch-data
# The container runs as uid 1001 (the unprivileged `nextjs` user). A bind mount
# keeps the host directory's owner, so a root-owned mount rejects every write —
# and dataset.ts swallows the error by design, so the only symptom is an empty
# directory. Own it to the container's uid.
chown 1001:65533 /opt/cosmeticsbatch-data
docker run -d --name cosmeticsbatch \
  --network yerelatlas_default --restart unless-stopped \
  -e DATASET_DIR=/data \
  -e SUBMISSIONS_DIR=/data/submissions \
  -e RESEND_API_KEY \
  -e SUBMISSION_NOTIFY_EMAIL \
  -e SUBMISSION_FROM_EMAIL \
  -v /opt/cosmeticsbatch-data:/data \
  cosmeticsbatch:latest
```

User-submitted batch-code photos are stored privately under
`/opt/cosmeticsbatch-data/submissions`. They are never served from `public/`.
Review `submissions/submissions.jsonl` for the pending queue and keep this volume
in the normal server backup policy.

Each submission is also sent through Resend with the photo attached. Set
`RESEND_API_KEY`, `SUBMISSION_NOTIFY_EMAIL` (your inbox), and
`SUBMISSION_FROM_EMAIL` (a sender on a Resend-verified domain) in `.env.build`.
The user address is set as `Reply-To`, so replying in your mail client answers
the user directly. A mail outage does not discard the private submission; a
`notification` event with `failed` or `not_configured` remains in the JSONL queue.

Inspect the data on the host (no need to enter the container):

```bash
DATASET_DIR=/opt/cosmeticsbatch-data node scripts/dataset-stats.mjs        # summary
DATASET_DIR=/opt/cosmeticsbatch-data node scripts/dataset-stats.mjs --csv  # export CSV
```

## Accelerate indexing after each deploy

Once the new container is live, ping IndexNow so Bing/Yandex/Seznam re-crawl the
changed pages within minutes (Google ignores IndexNow — use Search Console for
that). Run as the **last** deploy step, after the site is reachable:

```bash
node scripts/indexnow.mjs     # reads the live sitemap, submits every URL
```

Search Console verification is env-driven — set these Build Variables so the
`<meta>` tags render, then verify + submit the sitemap in each console:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<code from Google Search Console>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<code from Bing Webmaster Tools>
```
