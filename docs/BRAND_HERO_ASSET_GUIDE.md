# Brand hero asset handoff

Every brand page already uses the shared premium hero, checker and responsive
fallback. New artwork must be owner-provided or otherwise cleared for use and
must show only the named brand (neutral, licensed packaging is also acceptable).

## Delivery convention

- Desktop: `public/brands/heroes/{brand-slug}-hero.jpg`
- Optional mobile crop: `public/brands/heroes/{brand-slug}-mobile.jpg`
- Preferred desktop canvas: 1920×820 to 1920×960, products on the right and a
  calm text-safe area covering roughly the left 45%.
- Preferred mobile canvas: 900×1200 to 1080×1440, product focus in the right or
  lower-right third. Do not bake page headings, buttons or legal copy into it.
- JPEG/WebP target: 250–550 KB; hard review threshold: 700 KB.
- Use sRGB, avoid transparency unless essential, and do not upscale visibly
  soft source images.

## Activation

1. Add the optimized asset under `public/brands/heroes/`.
2. Add one entry to `BRAND_HERO_ASSETS` in
   `src/lib/brand-hero-assets.ts`, including desktop/mobile focal positions.
3. Add or adjust palette-only tokens in `BRAND_THEMES` in `src/lib/brands.ts`.
4. Run `npm run hero:inventory`, quality tests and the responsive viewport
   matrix. Missing mobile artwork is safe: the desktop image uses the configured
   mobile focal position. Missing all artwork is also safe: the shared premium
   gradient fallback remains visible with the verified logo/monogram.

Never reuse annotated batch-location evidence as hero artwork, fetch random web
images, mix products from different brands, redraw a trademark, or put text
inside the image that duplicates localized HTML content.
