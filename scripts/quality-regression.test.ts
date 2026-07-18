import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { BRAND_DETAILS } from "../src/lib/brand-detail";
import {
  ALL_BRANDS,
  BRANDS,
  INDEXED_BRANDS,
  isIndexedBrand,
  isMonetizableBrand,
} from "../src/lib/brands";
import { DECODER_GUIDES } from "../src/lib/decoder-guides";
import { DECODERS, canonicalCode } from "../src/lib/decoder";
import {
  ALL_LOCALES,
  FULL_QUALITY_LOCALES,
  INVESTMENT_PILOT_LOCALES,
  LOCALE_CODES,
  ORGANIC_PRESERVATION_LOCALES,
  RETIRED_LOCALE_CODES,
} from "../src/i18n/locales";
import { LOREAL_PRIORITY_LOCALES } from "../src/lib/loreal";
import {
  PHOTO_SUBMISSION_LOCALES,
  photoSubmissionCopy,
} from "../src/lib/photo-submission-copy";
import { getBrandLogoInventory } from "../src/lib/brand-logos";
import { asCsv, csvCell } from "../src/lib/csv";
import {
  INDEXABLE_LOCALES,
  PRIORITY_BRAND_SLUGS,
  indexableBrandLocales,
} from "../src/lib/publishing-policy";
import { DESCRIPTION_BUDGET, TITLE_BUDGET, fitTitle } from "../src/lib/snippet";
import {
  brandFunnel,
  dailySeries,
  decoderHealth,
  entryPages,
  localeSplit,
  reportDay,
  stripLocale,
  topPages,
  unattributedChecks,
} from "../src/lib/review-metrics";

const englishMessages = JSON.parse(
  readFileSync("messages/en.json", "utf8"),
) as { brandDetail?: Record<string, Record<string, string>> };
const englishContent = JSON.parse(
  readFileSync("messages/content/en.json", "utf8"),
) as Record<string, string>;
const reviewedContent = JSON.parse(
  readFileSync("messages/content/reviewed.json", "utf8"),
) as Record<string, string[]>;

test("review CSV exports neutralize spreadsheet formulas", () => {
  for (const value of ["=1+1", "+SUM(A1:A2)", "-2+3", "@cmd", "\t=1", "\r=1"]) {
    assert.equal(csvCell(value).startsWith("\"'"), true, value);
  }
  assert.equal(csvCell('safe "text"'), '"safe ""text"""');
  assert.match(
    asCsv([{ note: "=HYPERLINK(\"https://example.test\")", status: "pending" }]),
    /^"note","status"\n"'=HYPERLINK/,
  );
});

test("public decode paths never render decoder implementation details", () => {
  const api = readFileSync("src/app/api/decode/route.ts", "utf8");
  const resultCard = readFileSync("src/components/result-card.tsx", "utf8");
  assert.match(api, /method: _method, notes: _notes/);
  assert.doesNotMatch(resultCard, /result\.(method|notes)/);
});

test("active locale privacy copy matches server-side processing", () => {
  const forbidden = /direct(?:ly)? in (?:your|the) browser|browser[^.]{0,80}(?:never|not)[^.]{0,30}(?:stored|sent)|never (?:stored|sent)|nothing[^.]{0,80}(?:server|saved)|completely private/i;
  for (const locale of LOCALE_CODES) {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as {
      brandFaq: { a_free: string };
      homeFaq: { a2: string; a10: string };
      features: { privateBody: string };
    };
    const privacyCopy = [
      messages.brandFaq.a_free,
      messages.homeFaq.a2,
      messages.homeFaq.a10,
      messages.features.privateBody,
    ];
    assert.doesNotMatch(privacyCopy.join(" "), forbidden, locale);
    assert.match(privacyCopy.join(" "), /server/i, `${locale} omits server processing`);
  }
});

test("failed-code intelligence stays privacy-minimal and reviewable", () => {
  const dataset = readFileSync("src/lib/dataset.ts", "utf8");
  const activity = readFileSync("src/app/api/activity/route.ts", "utf8");
  const review = readFileSync("src/app/[locale]/review/page.tsx", "utf8");
  const photoForm = readFileSync("src/components/code-photo-submission.tsx", "utf8");
  assert.match(dataset, /failed-codes/);
  assert.match(dataset, /readChecksSince/);
  assert.match(review, /readChecksSince\(windowReport\)/);
  assert.match(dataset, /type: "visit" \| "page_view"/);
  assert.doesNotMatch(dataset, /interface ActivityLog[\s\S]{0,250}(email|cookie|ip:)/i);
  assert.match(activity, /!rawPath\.includes\("\?"\)/);
  assert.match(review, /Failed-code queue/);
  assert.match(review, /Approximate visits are anonymous browser sessions/);
  assert.match(photoForm, /focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(photoForm, /unresolved-code[\s\S]{0,500}scrollIntoView/);
});

test("publishing policy exposes exactly the 19 retained locales and 50 brands", () => {
  const tiers = [
    ...FULL_QUALITY_LOCALES,
    ...INVESTMENT_PILOT_LOCALES,
    ...ORGANIC_PRESERVATION_LOCALES,
  ];
  assert.equal(FULL_QUALITY_LOCALES.length, 6);
  assert.equal(INVESTMENT_PILOT_LOCALES.length, 6);
  assert.equal(ORGANIC_PRESERVATION_LOCALES.length, 7);
  assert.equal(tiers.length, 19);
  assert.equal(new Set(tiers).size, 19);
  assert.deepEqual([...LOCALE_CODES].sort(), [...tiers].sort());
  assert.deepEqual([...INDEXABLE_LOCALES].sort(), [...tiers].sort());
  assert.equal(RETIRED_LOCALE_CODES.length, 25);
  assert.equal(new Set(RETIRED_LOCALE_CODES).size, 25);
  assert.ok(RETIRED_LOCALE_CODES.every((locale) => !tiers.includes(locale as typeof tiers[number])));
  assert.ok([...tiers, ...RETIRED_LOCALE_CODES].every((locale) =>
    ALL_LOCALES.some((candidate) => candidate.code === locale),
  ));
  assert.ok(INDEXABLE_LOCALES.includes("en"));
  assert.equal(PRIORITY_BRAND_SLUGS.length, 50);
  assert.equal(new Set(PRIORITY_BRAND_SLUGS).size, 50);
  for (const slug of PRIORITY_BRAND_SLUGS) {
    assert.ok(ALL_BRANDS.some((brand) => brand.slug === slug), `${slug} is not a catalog brand`);
    for (const locale of indexableBrandLocales(slug)) {
      assert.ok(INDEXABLE_LOCALES.includes(locale as typeof INDEXABLE_LOCALES[number]));
      assert.ok(Object.hasOwn(BRAND_DETAILS, slug), `${slug} lacks editorial evidence`);
    }
  }
});

test("brand catalog has unique identities and valid core fields", () => {
  assert.equal(new Set(ALL_BRANDS.map((brand) => brand.slug)).size, ALL_BRANDS.length);
  assert.equal(
    new Set(ALL_BRANDS.map((brand) => brand.name.trim().toLocaleLowerCase("en"))).size,
    ALL_BRANDS.length,
  );
  for (const brand of ALL_BRANDS) {
    assert.ok(brand.name.trim(), `${brand.slug} has no name`);
    assert.ok(brand.group.trim(), `${brand.slug} has no parent/manufacturer group`);
    assert.ok(brand.shelfLifeMonths > 0, `${brand.slug} has invalid shelf life`);
    assert.ok(brand.paoMonths > 0, `${brand.slug} has invalid PAO`);
    if (brand.decoderId) {
      assert.ok(DECODERS[brand.decoderId], `${brand.slug} references unknown decoder ${brand.decoderId}`);
    }
  }
});

test("brand batch-code galleries are bounded and reference public assets", () => {
  for (const brand of ALL_BRANDS) {
    assert.ok(
      (brand.codeImages?.length ?? 0) <= 3,
      `${brand.slug} exposes more than three batch-code photos`,
    );
    for (const image of brand.codeImages ?? []) {
      assert.match(image.src, /^\/brands\//, `${brand.slug} has a non-brand image path`);
      assert.ok(
        existsSync(`public${image.src}`),
        `${brand.slug} references missing image ${image.src}`,
      );
      assert.ok(image.width > 0 && image.height > 0, `${image.src} has invalid dimensions`);
    }
  }
});

test("brand-page themes stay data-driven and hero assets remain local", () => {
  for (const brand of ALL_BRANDS) {
    if (!brand.theme) continue;
    for (const source of [brand.theme.heroImage, brand.theme.mobileHeroImage]) {
      if (!source) continue;
      assert.match(source, /^\/brands\//, `${brand.slug} has a non-local hero image`);
      assert.ok(existsSync(`public${source}`), `${brand.slug} references missing hero ${source}`);
    }
  }
  const page = readFileSync("src/app/[locale]/brands/[slug]/page.tsx", "utf8");
  assert.match(page, /getBrandTheme\(brand\.category, brand\.theme\)/);
  assert.doesNotMatch(page, /brand\.slug\s*===\s*["']vichy/);
});

test("changing the picker on a brand page navigates to the selected brand page", () => {
  const form = readFileSync("src/components/check-form.tsx", "utf8");
  const page = readFileSync("src/app/[locale]/brands/[slug]/page.tsx", "utf8");
  assert.match(form, /navigateOnBrandChange && b\.slug !== brand\?\.slug/);
  assert.match(form, /router\.push\(`\/brands\/\$\{b\.slug\}`\)/);
  assert.match(page, /navigateOnBrandChange/);
});

test("every indexable brand meets the editorial and decoder threshold", () => {
  assert.deepEqual(
    INDEXED_BRANDS.map((brand) => brand.slug).sort(),
    Object.keys(BRAND_DETAILS).sort(),
  );
  const now = new Date("2026-07-14T12:00:00Z");
  for (const [slug, detail] of Object.entries(BRAND_DETAILS)) {
    const brand = BRANDS.find((candidate) => candidate.slug === slug);
    assert.ok(brand, `${slug} editorial record has no public brand`);
    assert.ok(isIndexedBrand(brand), `${slug} is not indexable`);
    assert.ok(isMonetizableBrand(brand), `${slug} is indexable without a decoder`);
    const decoder = DECODERS[brand.decoderId ?? ""];
    assert.ok(decoder, `${slug} has no registered decoder`);
    assert.ok(
      decoder.decode(detail.sampleCode, { now })?.manufactureDate,
      `${slug} sample ${detail.sampleCode} does not decode`,
    );
    const copy = englishMessages.brandDetail?.[slug];
    assert.ok(copy?.where1, `${slug} lacks brand-specific code-location copy`);
    assert.ok(copy?.faq1q && copy?.faq1a, `${slug} lacks a complete brand-specific FAQ`);
  }
});

test("decoder guides cover registered decoders without unknown references", () => {
  const documented = new Set(DECODER_GUIDES.flatMap((guide) => guide.decoderIds));
  assert.deepEqual([...documented].sort(), Object.keys(DECODERS).sort());
  for (const guide of DECODER_GUIDES) {
    assert.ok(guide.decoderIds.length > 0, `${guide.slug} has no decoder`);
    for (const id of guide.decoderIds) {
      assert.ok(DECODERS[id], `${guide.slug} references unknown decoder ${id}`);
    }
  }
});

test("content review manifest contains only known, current source keys", () => {
  const sourceKeys = new Set(Object.keys(englishContent));
  for (const [locale, keys] of Object.entries(reviewedContent)) {
    assert.ok(LOCALE_CODES.includes(locale), `review manifest contains inactive locale ${locale}`);
    assert.equal(new Set(keys).size, keys.length, `${locale} review manifest has duplicate keys`);
    for (const key of keys) assert.ok(sourceKeys.has(key), `${locale} reviewed unknown key ${key}`);
  }
  // Russian is the fully hand-reviewed locale, with documented exceptions from
  // the 2026-07-16 work: (a) the Creed and Dior guides were rewritten after their
  // old ciphers proved wrong, and (b) every decoder-guide title/description was
  // neutralised to stop publishing the proprietary decode method. Those strings
  // were re-translated by machine and un-reviewed pending native re-review.
  // Russian must still cover the rest of the corpus.
  const pendingReReview =
    /^dec\.(creed-batch-code-format|dior-lvmh-batch-code-format)\.|^dec\..*\.(title|desc)$/;
  const ruReviewed = new Set(reviewedContent.ru ?? []);
  for (const key of sourceKeys) {
    if (ruReviewed.has(key)) continue;
    assert.ok(
      pendingReReview.test(key),
      `Russian reviewed corpus is missing ${key}; only Creed/Dior guide strings may be pending re-review`,
    );
  }
});

test("priority L'Oréal locales contain complete cautious editorial copy", () => {
  const requiredFamilyKeys = [
    "heading",
    "portfolio",
    "format",
    "precision",
    "authenticity",
    "officialSource",
    "decoderLabel",
  ];
  for (const locale of LOREAL_PRIORITY_LOCALES) {
    const messages = JSON.parse(
      readFileSync(`messages/${locale}.json`, "utf8"),
    ) as {
      brandPage?: Record<string, string>;
      lorealFamily?: Record<string, string>;
    };
    assert.ok(messages.brandPage?.decoderGuideBody, `${locale} lacks decoder guide copy`);
    assert.ok(messages.brandPage?.decoderGuideLink, `${locale} lacks decoder guide link`);
    for (const key of requiredFamilyKeys) {
      assert.ok(messages.lorealFamily?.[key]?.trim(), `${locale} lacks lorealFamily.${key}`);
    }
    const claims = [
      messages.brandPage?.metaTitle,
      messages.brandPage?.metaDescription,
      messages.brandPage?.blurb,
      messages.brandPage?.intro,
    ].join(" ");
    assert.doesNotMatch(
      claims,
      /help check authenticity|and check authenticity|проверка на подлинность —|die Echtheit checken/i,
      `${locale} promises an authenticity check`,
    );
  }
});

test("traffic reports merge locales and read entry pages from visit rows", () => {
  // The default locale is prefix-free and the rest are not. Getting this wrong
  // splits one page's traffic across 44 rows, silently.
  assert.equal(stripLocale("/ru/brands/dior"), "/brands/dior");
  assert.equal(stripLocale("/brands/dior"), "/brands/dior");
  assert.equal(stripLocale("/yue"), "/");
  assert.equal(stripLocale("/"), "/");
  // "dior" is not a locale, so a page that happens to sit at the root keeps it.
  assert.equal(stripLocale("/check"), "/check");

  const activity = [
    { ts: "2026-07-18T10:00:00.000Z", type: "visit" as const, path: "/ru/brands/dior", locale: "ru" },
    { ts: "2026-07-18T10:00:00.000Z", type: "page_view" as const, path: "/ru/brands/dior", locale: "ru" },
    { ts: "2026-07-18T10:01:00.000Z", type: "page_view" as const, path: "/brands/dior", locale: "en" },
    { ts: "2026-07-18T10:02:00.000Z", type: "visit" as const, path: "/check", locale: "en" },
  ];
  assert.deepEqual(topPages(activity), [{ path: "/brands/dior", count: 2 }]);
  assert.deepEqual(entryPages(activity), [
    { path: "/brands/dior", count: 1 },
    { path: "/check", count: 1 },
  ]);
  assert.deepEqual(localeSplit(activity), [
    { path: "en", count: 1 },
    { path: "ru", count: 1 },
  ]);

  // A brand page that is read but never used must be visible as such.
  const funnel = brandFunnel(activity, [
    { ts: "2026-07-18T10:03:00.000Z", brand: "dior", path: "/ru/brands/dior", confidence: "high", mfg: "2025-01-15" },
    { ts: "2026-07-18T10:04:00.000Z", brand: "dior", path: "/check", confidence: "high", mfg: "2025-02-15" },
    { ts: "2026-07-18T10:05:00.000Z", brand: "dior", confidence: "high", mfg: "2025-03-15" },
  ]);
  const dior = funnel.find((row) => row.slug === "dior");
  assert.equal(dior?.views, 2);
  assert.equal(dior?.checks, 1);
  assert.equal(dior?.decoded, 1);
  assert.equal(dior?.conversion, 50);
  // The two checks that no page can claim stay visible as a count rather than
  // quietly dragging the rate down.
  assert.equal(unattributedChecks([
    { ts: "2026-07-18T10:04:00.000Z", brand: "dior", path: "/check", confidence: "high", mfg: null },
    { ts: "2026-07-18T10:05:00.000Z", brand: "dior", confidence: "high", mfg: null },
  ]), 1);
  // A brand only ever checked from the site-wide checker gets no page row.
  assert.equal(brandFunnel([], [
    { ts: "2026-07-18T10:04:00.000Z", brand: "dior", path: "/check", confidence: "high", mfg: null },
  ]).length, 0);
});

test("daily buckets follow the zone the dashboard prints", () => {
  // 22:30 UTC on the 18th is already the 19th in Istanbul (UTC+3). Bucketing in
  // UTC dropped such rows into a different day than the tables beside them.
  assert.equal(reportDay("2026-07-18T22:30:00.000Z"), "2026-07-19");
  assert.equal(reportDay("2026-07-18T20:59:00.000Z"), "2026-07-18");

  const series = dailySeries(
    [{ ts: "2026-07-18T22:30:00.000Z", type: "page_view" as const, path: "/", locale: "en" }],
    [],
    [],
    2,
    Date.parse("2026-07-19T09:00:00.000Z"),
  );
  assert.deepEqual(series.map((point) => point.day), ["2026-07-18", "2026-07-19"]);
  assert.equal(series[1].views, 1, "a late-evening view belongs to the Istanbul day");
});

test("decoder health ranks the brands turning users away", () => {
  const checks = [
    { ts: "2026-07-18T10:00:00.000Z", brand: "skin1004", confidence: "none", mfg: null },
    { ts: "2026-07-18T10:01:00.000Z", brand: "skin1004", confidence: "none", mfg: null },
    { ts: "2026-07-18T10:02:00.000Z", brand: "vichy", confidence: "high", mfg: "2024-06-15" },
    { ts: "2026-07-18T10:03:00.000Z", brand: "vichy", confidence: "high", mfg: "2024-07-15" },
  ];
  const health = decoderHealth(checks, []);
  assert.equal(health[0].slug, "skin1004", "the worst brand must sort first");
  assert.equal(health[0].failRate, 100);
  assert.equal(health.find((row) => row.slug === "vichy")?.failRate, 0);
});

test("failed-code grouping collapses retries without merging distinct codes", () => {
  // Spacing and case are typing noise: one user retrying the same code must
  // land on one row in the review queue.
  const spellings = ["TCR15X", "TCR 15X", "TCR 15 X", "tcr15x"];
  const collapsed = new Set(spellings.map(canonicalCode));
  assert.equal(collapsed.size, 1, `retries split into ${[...collapsed].join(", ")}`);

  // O and 0 are not interchangeable: a L'Oréal month of "O" is October, so
  // folding them together would merge a readable code with an unreadable one.
  assert.notEqual(canonicalCode("40ZO01"), canonicalCode("40Z001"));
  assert.notEqual(canonicalCode("TCR15X"), canonicalCode("TCR1SX"));

  // Failure classification is presentation data, not part of code identity.
  const attempts = [
    { code: "TCR 15X", reason: "invalid-format" },
    { code: "tcr15x", reason: "unresolved" },
  ];
  const groups = new Map<string, Map<string, number>>();
  for (const attempt of attempts) {
    const key = canonicalCode(attempt.code);
    const reasons = groups.get(key) ?? new Map<string, number>();
    reasons.set(attempt.reason, (reasons.get(attempt.reason) ?? 0) + 1);
    groups.set(key, reasons);
  }
  assert.equal(groups.size, 1);
  assert.deepEqual([...groups.values()][0], new Map([
    ["invalid-format", 1],
    ["unresolved", 1],
  ]));
});

test("every brand-page snippet survives the search result", () => {
  for (const locale of LOCALE_CODES) {
    const { brandPage } = JSON.parse(
      readFileSync(`messages/${locale}.json`, "utf8"),
    ) as { brandPage: Record<string, string> };
    assert.ok(brandPage.metaTitleShort?.trim(), `${locale} lacks metaTitleShort`);
    assert.match(
      brandPage.metaTitleShort,
      /\{name\}/,
      `${locale} short title lost the brand placeholder`,
    );
    for (const brand of INDEXED_BRANDS) {
      const fill = (s: string) => s.replace(/\{name\}/g, brand.name);
      const title = fitTitle(
        fill(brandPage.metaTitle),
        fill(brandPage.metaTitleShort),
      );
      assert.ok(
        title.length <= TITLE_BUDGET,
        `${locale}/${brand.slug} title is ${title.length} chars: ${title}`,
      );
      const description = fill(brandPage.metaDescription);
      assert.ok(
        description.length <= DESCRIPTION_BUDGET,
        `${locale}/${brand.slug} description is ${description.length} chars`,
      );
    }
  }
});

test("reviewed Russian brand-page copy has no known English fallback leak", () => {
  const russian = JSON.parse(readFileSync("messages/ru.json", "utf8")) as {
    brandPage: Record<string, string>;
  };
  for (const [key, value] of Object.entries(russian.brandPage)) {
    assert.doesNotMatch(value, /Once we read|You'll sometimes see|No sign-up/i, key);
  }
});

test("photo review flow has complete copy for every active locale", () => {
  assert.ok(LOCALE_CODES.every((locale) => PHOTO_SUBMISSION_LOCALES.includes(locale)));
  for (const locale of LOCALE_CODES) {
    const copy = photoSubmissionCopy(locale);
    assert.equal(Object.keys(copy).length, 20, `${locale} has incomplete photo copy`);
    for (const [key, value] of Object.entries(copy)) {
      assert.ok(value.trim(), `${locale} photo copy ${key} is empty`);
      assert.doesNotMatch(value, /^ਹੈ\s*$/u, `${locale} contains a broken translation fragment`);
    }
    assert.match(copy.title, /BRANDNAME/, `${locale} title lost brand placeholder`);
    assert.match(copy.reply, /EMAILADDRESS/, `${locale} reply lost email placeholder`);
  }
});

test("brand logo inventory contains only verified local Wikidata assets", () => {
  const inventory = getBrandLogoInventory();
  assert.ok(Object.keys(inventory).length >= 70, "Wikidata logo coverage regressed below baseline");
  for (const [slug, logo] of Object.entries(inventory)) {
    assert.ok(ALL_BRANDS.some((brand) => brand.slug === slug), `${slug} is not a catalog brand`);
    assert.match(logo.qid, /^Q\d+$/, `${slug} has an invalid Wikidata entity`);
    assert.equal(logo.domainVerified, true, `${slug} was not verified by official domain`);
    assert.match(logo.src, /^\/brand-logos\//, `${slug} has a non-local logo`);
    assert.ok(existsSync(`public${logo.src}`), `${slug} references missing ${logo.src}`);
    if (logo.src.endsWith(".svg")) {
      const svg = readFileSync(`public${logo.src}`, "utf8");
      assert.doesNotMatch(
        svg,
        /<script|javascript:|onload=|onerror=|<image|<foreignObject/i,
        `${slug} logo contains active or externally embedded SVG content`,
      );
    }
  }
  const component = readFileSync("src/components/ui/brand-logo.tsx", "utf8");
  assert.doesNotMatch(component, /favicon|logoSources|https?:\/\//i);
});

test("homepage marquee uses curated local wordmarks instead of favicons", () => {
  const component = readFileSync("src/components/home/popular-brands.tsx", "utf8");
  assert.doesNotMatch(component, /from\s+["'].*brand-logo|<BrandLogo|getBrandDomain/);
  const assets = [
    "carolina-herrera.svg",
    "chanel.svg",
    "creed.svg",
    "dior.svg",
    "estee-lauder.svg",
    "jean-paul-gaultier.svg",
    "lancome.svg",
    "maybelline.svg",
    "paco-rabanne.svg",
    "ysl-beauty.svg",
  ];
  for (const asset of assets) {
    const path = `public/brand-wordmarks/${asset}`;
    assert.ok(existsSync(path), `missing homepage wordmark ${asset}`);
    const svg = readFileSync(path, "utf8");
    assert.match(svg, /<svg\b/i, `${asset} is not SVG`);
    assert.doesNotMatch(
      svg,
      /<script|javascript:|onload=|onerror=|<image|<foreignObject/i,
      `${asset} contains active or externally embedded SVG content`,
    );
  }
});

test("public page routes do not reintroduce a noindex directive", () => {
  const metadataRoutes = [
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/brands/[slug]/page.tsx",
    "src/app/[locale]/check/page.tsx",
    "src/app/[locale]/contact/page.tsx",
    "src/app/[locale]/decoders/page.tsx",
    "src/app/[locale]/decoders/[slug]/page.tsx",
    "src/app/[locale]/guides/page.tsx",
    "src/app/[locale]/guides/[slug]/page.tsx",
    "src/app/[locale]/privacy/page.tsx",
    "src/app/[locale]/terms/page.tsx",
  ];
  for (const file of metadataRoutes) {
    assert.doesNotMatch(
      readFileSync(file, "utf8"),
      /index:\s*false/,
      `${file} contains noindex`,
    );
  }
  assert.doesNotMatch(
    readFileSync("src/app/robots.ts", "utf8"),
    /disallow:/i,
    "robots.ts blocks a public route",
  );
});

test("private review routes are excluded from analytics and consent rendering", () => {
  const layout = readFileSync("src/app/[locale]/layout.tsx", "utf8");
  const boundary = readFileSync("src/components/tracking-boundary.tsx", "utf8");
  assert.doesNotMatch(
    layout,
    /googletagmanager|YandexMetrica|CookieConsent|dangerouslySetInnerHTML/,
    "root locale layout still injects tracking directly",
  );
  assert.match(boundary, /pathname\.split\("\/"\)\.includes\("review"\)/);
  assert.match(boundary, /if \(isPrivateReviewPath\(pathname\)\) return null/);
  assert.match(boundary, /googletagmanager\.com|YandexMetrica|CookieConsent/);
});
