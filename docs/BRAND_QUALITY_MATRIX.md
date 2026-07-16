# Priority-50 brand quality matrix

Last reviewed: 2026-07-16
Policy source: `src/lib/publishing-policy.ts`

This is the operational queue for the 50-brand quality program. A place in the
priority list records demand or strategic value; it does **not** prove a decoder
or make a page indexable.

## Current position

- Priority brands: **50**
- Passing the current editorial/sample gate: **26**
- Still noindex: **24**
- Passing brands with 1–3 active local batch-code images: **10**
- Passing brands without a local batch-code image: **16**
- Decoder profiles with a stored primary/reference URL: **0**

The last point is a material limitation. Current decoders are conservative and
fixture-tested, but their profile registry still labels the evidence as
observed, estimated, format-only or unknown. Do not describe the collection as
“50 proven brands” until source references and brand applicability are recorded.

## Gate definitions

- **Decoder**: a runtime decoder is assigned to the catalog brand. This alone
  does not prove that every factory, market or historical package uses it.
- **Sample/editorial**: `BRAND_DETAILS` contains a fixture plus the English
  brand-specific packaging-location and FAQ material required by tests.
- **Images**: count of active local batch-code images; maximum is 3. Presence in
  the repository is not by itself proof of ownership, permission or provenance.
- **Index**: current policy outcome. Passing brands initially expose English and
  Russian only. Every other locale-brand pair remains noindex until reviewed.

## Passing group — 26

| Brand | Decoder | Sample | Images | Current index | Principal remaining gap |
|---|---|---:|---:|---|---|
| L'Oréal Paris | loreal | `22U401` | 0 | EN, RU | primary provenance; original images |
| Nivea | beiersdorf | `8153554` | 0 | EN, RU | primary provenance; original images |
| Dior | dior | `5H03` | 0 | EN, RU | numeric ambiguity; original images |
| Kérastase | loreal | `22U401` | 0 | EN, RU | brand applicability; original images |
| Vichy | loreal | `22U401` | 2 | EN, RU | primary provenance; third image optional |
| Lancôme | loreal | `31YO500` | 3 | EN, RU | primary provenance |
| Estée Lauder | estee-lauder | `A56` | 3 | EN, RU | decade ambiguity; primary provenance |
| MAC Cosmetics | estee-lauder | `B23` | 3 | EN, RU | brand applicability; primary provenance |
| Maybelline | loreal | `40X200` | 0 | EN, RU | primary provenance; original images |
| Creed | creed | `A4221N01` | 3 | EN, RU | year-only precision; primary provenance |
| Paco Rabanne | embedded | `4135` | 0 | EN, RU | manufacturer applicability; original images |
| Jean Paul Gaultier | embedded | `24045` | 3 | EN, RU | manufacturer applicability |
| CeraVe | loreal | `40X200` | 0 | EN, RU | regional applicability; original images |
| Escada | coty | `0175` | 3 | EN, RU | decade ambiguity; primary provenance |
| Garnier | loreal | `31YO500` | 0 | EN, RU | primary provenance; original images |
| Dunhill | interparfums | `08J38J169` | 0 | EN, RU | primary provenance; original images |
| Guerlain | dior | `3245` | 0 | EN, RU | shared-format evidence; original images |
| Kenzo Parfums | dior | `24045` | 0 | EN, RU | shared-format evidence; original images |
| Chanel | chanel | `3245` | 3 | EN, RU | numeric ambiguity; primary provenance |
| Roberto Cavalli | coty | `4135` | 0 | EN, RU | decade ambiguity; original images |
| Kiehl's | loreal | `22U401` | 0 | EN, RU | brand applicability; original images |
| Montblanc | interparfums | `08J38J169` | 0 | EN, RU | primary provenance; original images |
| Zara | embedded | `4135` | 3 | EN, RU | manufacturer applicability |
| Giorgio Armani Beauty | loreal | `40X200` | 0 | EN, RU | brand applicability; original images |
| Carolina Herrera | embedded | `231122` | 3 | EN, RU | manufacturer applicability |
| YSL Beauty | loreal | `22U401` | 0 | EN, RU | brand applicability; original images |

## Blocked group — 24

| Brand | Catalog decoder | Images | Blocker before indexing |
|---|---|---:|---|
| Dove | unilever | 0 | verified sample, brand-specific evidence and images |
| Bottega Veneta | coty | 0 | verified sample, brand-specific evidence and images |
| Chanel Beauty | chanel | 0 | replace quarantined third-party/watermarked assets; verified sample and editorial record |
| Innisfree | kbeauty | 0 | brand-level format applicability, sample, editorial and images |
| Jimmy Choo | interparfums | 0 | verified sample, brand-specific evidence and images |
| Maison Margiela | loreal | 0 | brand applicability, sample, editorial and images |
| Neutrogena | kenvue | 0 | verified sample, printed-date variants, editorial and images |
| Loewe Perfumes | dior | 0 | shared-format evidence, sample, editorial and images |
| Gucci Beauty | coty | 0 | verified sample, brand-specific evidence and images |
| Color Wow | none; hidden | 0 | verified decoder first; restore public catalog only afterwards |
| Chloé | coty | 0 | verified sample, brand-specific evidence and images |
| Boucheron | interparfums | 0 | verified sample, brand-specific evidence and images |
| Anua | kbeauty | 3 | prove brand-level date/batch interpretation; sample and editorial |
| Shiseido | shiseido | 2 | verified sample and brand-specific editorial record |
| Prada Beauty | loreal | 0 | brand applicability, sample, editorial and images |
| NYX Professional Makeup | loreal | 0 | brand applicability, sample, editorial and images |
| Nina Ricci | embedded | 0 | manufacturer-specific evidence, sample, editorial and images |
| Moncler | interparfums | 0 | verified sample, brand-specific evidence and images |
| Coach | interparfums | 0 | verified sample, brand-specific evidence and images |
| Salvatore Ferragamo | interparfums | 0 | verified sample, brand-specific evidence and images |
| Aesop | loreal | 3 | prove format applicability; sample and brand-specific editorial |
| Beauty of Joseon | kbeauty | 0 | brand-level format applicability, sample, editorial and images |
| La Mer | estee-lauder | 0 | brand applicability, sample, editorial and images |
| Abercrombie & Fitch | interparfums | 0 | verified sample, brand-specific evidence and images |

## Work order

### P0 — strengthen pages already earning exposure

1. Add source/provenance records for the L'Oréal, Dior/LVMH, Estée Lauder,
   Coty, Inter Parfums, Chanel, Creed, Beiersdorf and embedded-format families.
2. Process approved owner-supplied photos for the 16 passing brands with no
   image. Keep the existing maximum of three and mark the code area only when
   the visible evidence supports it.
3. Re-check the sample against the photographed package and record region,
   product type, source/submission ID and review date privately.

### P1 — fastest evidence-backed unlocks

1. Chanel Beauty: the decoder exists, but the three former assets visibly used
   third-party/retailer imagery and watermarks. They were removed from the
   active gallery. Obtain owner-created or explicitly licensed photos before a
   verified fixture and genuinely brand-specific editorial record are added.
2. Shiseido: two images and a dedicated decoder exist; verify one visible code
   and its printed-date meaning before adding the editorial record.
3. Aesop and Anua: images exist, but parent/group association or a generic
   Korean date format is not proof of brand-level decoder applicability.

### P2 — remaining acquisition queue

Collect an owner-approved 1–3 photo evidence set and a real code for the other
20 blocked brands. Decoder assignment must follow the evidence; do not choose a
rule merely from current ownership or visual similarity.

## Definition of done for a new locale-brand pair

The row may be added to `indexableBrandLocales` only after natural-language
review of the title, description, intro, packaging location, limitations,
authenticity warning and FAQ. Record reviewer and date. Metadata, visible copy,
schema, sitemap, hreflang and ad eligibility must change together.
