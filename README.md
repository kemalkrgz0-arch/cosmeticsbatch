# CheckBeauty

Premium cosmetic & perfume **batch code checker**. Decode any supported code to find the manufacture date, product age, freshness and estimated expiration — free, instant, private.

Built to outperform CheckFresh / BatchCode / CheckCosmetic on speed, SEO and UI.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack) · React 19 · TypeScript
- **Tailwind CSS v4** design system · next-themes (light/dark) · lucide-react
- No database — decoding is pure TypeScript, pages are SSG/edge-friendly
- Deploy target: **Vercel**

## How decoding works

`src/lib/decoder/` is the core engine. Instead of scraping other sites, it
implements **per-manufacturer date-code algorithms**:

| Decoder | Brands | Confidence |
|---|---|---|
| `estee-lauder` | Estée Lauder, MAC, Clinique, La Mer, Jo Malone… | high |
| `coty` | Rimmel, CK, Hugo Boss, Gucci, Burberry… | medium |
| `julian` (auto) | date embedded in code (YYDDD / YYMMDD…) | medium/low |

Unmatched brands fall back to the Julian auto-detector. Every result carries an
honest confidence level. Freshness = manufacture date + the brand's typical
shelf life.

## Project layout

```
src/
  app/            routes: /, /check, /brands, /brands/[slug], /guides, /guides/[slug], /about
                  + sitemap.ts, robots.ts, manifest.ts, icon.svg
  components/     check-form (core combobox+input+CTA), result-card, layout/, home/, ui/
  lib/            decoder/, brands.ts, guides.ts, site.ts, seo.ts, utils.ts
```

- `/brands/[slug]` — 54 statically generated, indexable programmatic-SEO pages.
- `/check` — result page, `noindex` (per-user query permutations).
- JSON-LD: Organization, WebSite+SearchAction, Breadcrumb, FAQ, Article.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

> If `pnpm install` complains about ignored build scripts, ensure
> `pnpm-workspace.yaml` sets `allowBuilds: { sharp: true, unrs-resolver: true }`.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` in production for correct canonical + OpenGraph URLs.
Ad slots are fixed-height reserved containers (`components/ui/ad-slot.tsx`) —
drop AdSense units in without causing layout shift.
