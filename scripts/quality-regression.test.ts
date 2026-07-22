import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
import { DECODERS, canonicalCode, checkBatchCode } from "../src/lib/decoder";
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
import { ATTRIBUTION_FREE_LICENCES, brandTile, getBrandLogoInventory, getBrandTile, logosRequiringAttribution } from "../src/lib/brand-logos";
import { asCsv, csvCell } from "../src/lib/csv";
import {
  ENGLISH_ONLY_LOCALES,
  INDEXABLE_LOCALES,
  PRIORITY_BRAND_SLUGS,
  indexableBrandLocales,
} from "../src/lib/publishing-policy";
import { DESCRIPTION_BUDGET, TITLE_BUDGET, fitSnippet, fitTitle, snippetLength } from "../src/lib/snippet";
import { brandSnippet } from "../src/lib/brand-snippets";
import { normalizeActivityPath } from "../src/lib/activity-path";
import { MAX_TRACKED_KEYS, checkRateLimit, trackedKeyCount } from "../src/lib/rate-limit";
import { brandsDirectoryCopy } from "../src/lib/brands-directory-copy";
import {
  brandFunnel,
  dailySeries,
  decoderHealth,
  decoderHealthTrend,
  entryPages,
  localeSplit,
  reportDay,
  stripLocale,
  topPages,
  trend,
  unattributedChecks,
} from "../src/lib/review-metrics";
import { decodeAccessPart } from "../src/lib/review-auth";
import { photoTransformPlan } from "../src/lib/photo-transform";
import { BRAND_DETAIL_GAPS, hasReviewedBrandDetailKey } from "../src/lib/locale-message-gaps";
import { isAdEligibleLocale } from "../src/lib/ads";
import { printsDateHintKey } from "../src/lib/result-failure-copy";

const englishMessages = JSON.parse(
  readFileSync("messages/en.json", "utf8"),
) as { brandDetail?: Record<string, Record<string, string>> };
const englishContent = JSON.parse(
  readFileSync("messages/content/en.json", "utf8"),
) as Record<string, string>;
const reviewedContent = JSON.parse(
  readFileSync("messages/content/reviewed.json", "utf8"),
) as Record<string, string[]>;

test("message catalogs exist only for the 19 active locale routes", () => {
  const catalogs = readdirSync("messages")
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -5))
    .sort();
  assert.deepEqual(catalogs, [...LOCALE_CODES].sort());
  for (const locale of RETIRED_LOCALE_CODES) {
    assert.equal(existsSync(`messages/${locale}.json`), false, `${locale} catalog was reactivated`);
  }
});

test("the brand-detail gap manifest matches the catalogs, per locale", () => {
  const flatten = (value: Record<string, unknown>, prefix = "", out: Record<string, unknown> = {}) => {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (child && typeof child === "object" && !Array.isArray(child))
        flatten(child as Record<string, unknown>, path, out);
      else out[path] = child;
    }
    return out;
  };
  const english = flatten(JSON.parse(readFileSync("messages/en.json", "utf8")) as Record<string, unknown>);
  const englishBrandDetail = Object.keys(english)
    .filter((key) => key.startsWith("brandDetail."))
    .map((key) => key.slice("brandDetail.".length));

  // Locales are translated at different rates, so the manifest is per locale.
  // Recomputing it here is what stops the generated file drifting from the
  // catalogs when a key is added or a language is finished.
  for (const locale of LOCALE_CODES.filter((code) => code !== "en")) {
    const localized = flatten(JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as Record<string, unknown>);
    const missing = englishBrandDetail
      .filter((key) => !(`brandDetail.${key}` in localized))
      .sort();
    assert.deepEqual(
      [...(BRAND_DETAIL_GAPS[locale] ?? [])].sort(),
      missing,
      `${locale} brand-detail gap manifest drifted — rerun scripts/build-locale-message-gaps.mjs`,
    );
  }

  // A fully translated locale must not appear at all, or its own content stays
  // hidden. Turkish is the case that proved the old single-set model wrong.
  assert.equal(BRAND_DETAIL_GAPS.tr, undefined, "tr is fully translated and must carry no gaps");
  assert.equal(hasReviewedBrandDetailKey("tr", "vichy", "faq1a"), true);
  // The false case needs a locale that genuinely still lacks the key. Russian
  // used to be it and was translated on 2026-07-21, which is why this line
  // moved rather than being deleted — the assertion is about the gating
  // function, not about Russian.
  assert.equal(hasReviewedBrandDetailKey("id", "vichy", "faq1a"), false);
  assert.equal(hasReviewedBrandDetailKey("en", "vichy", "faq1a"), true);

  const page = readFileSync("src/app/[locale]/brands/[slug]/page.tsx", "utf8");
  assert.match(page, /hasReviewedBrandDetailKey\(locale, brand\.slug, `faq\$\{i\}a`\)/);
});

test("AdSense inventory remains limited to the fully reviewed English locale", () => {
  assert.equal(isAdEligibleLocale("en"), true);
  for (const locale of LOCALE_CODES.filter((code) => code !== "en"))
    assert.equal(isAdEligibleLocale(locale), false, `${locale} unexpectedly became ad eligible`);
});

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

test("Access JWT parts reject valid JSON primitives", () => {
  for (const primitive of [null, [], "text"]) {
    const encoded = Buffer.from(JSON.stringify(primitive)).toString("base64url");
    for (const part of ["header", "payload"]) {
      assert.throws(
        () => decodeAccessPart<Record<string, unknown>>(encoded),
        { message: "Invalid Access token" },
        `${part} accepted ${JSON.stringify(primitive)}`,
      );
    }
  }
});

test("photo zoom instructions match scroll-based panning", () => {
  const photo = readFileSync("src/components/review/submission-photo.tsx", "utf8");
  assert.match(photo, /full resolution — scroll to pan/);
  assert.doesNotMatch(photo, /drag to pan/);
});

test("public decode paths never render decoder implementation details", () => {
  const api = readFileSync("src/app/api/decode/route.ts", "utf8");
  const checkPage = readFileSync("src/app/[locale]/check/page.tsx", "utf8");
  const resultCard = readFileSync("src/components/result-card.tsx", "utf8");
  assert.match(api, /method: _method, notes: _notes/);
  assert.match(checkPage, /method: _method, notes: _notes, \.\.\.publicResult/);
  assert.match(checkPage, /<ResultCard result=\{publicResult\}/);
  assert.doesNotMatch(checkPage, /<ResultCard result=\{result\}/);
  assert.doesNotMatch(resultCard, /result\.(method|notes)/);
});

test("active locale privacy copy matches server-side processing", () => {
  const forbidden = /direct(?:ly)? in (?:your|the) browser|browser[^.]{0,80}(?:never|not)[^.]{0,30}(?:stored|sent)|never (?:stored|sent)|nothing[^.]{0,80}(?:server|saved)|completely private/i;
  const serverTerm: Record<string, RegExp> = {
    de: /Server/i, es: /servidor/i, it: /server/i, fr: /serveur/i,
    ja: /サーバー/u, tr: /sunucu/i, nl: /server/i, sv: /server/i,
    da: /server/i, ko: /서버/u, ar: /خادم/u, pt: /servidor/i,
    vi: /máy chủ/iu, id: /server/i, pl: /serwer/i, ru: /сервер/iu,
    zh: /服务器/u, yue: /伺服器/u,
  };
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
    assert.match(
      privacyCopy.join(" "), serverTerm[locale] ?? /server/i,
      `${locale} omits server processing`,
    );
  }
});

test("homepage metadata and HowTo schema describe estimates truthfully", () => {
  const site = readFileSync("src/lib/site.ts", "utf8");
  const seo = readFileSync("src/lib/seo.ts", "utf8");
  assert.match(site, /Estimate a product's manufacture date and age/);
  assert.match(site, /typical unopened shelf life and PAO guidance/);
  assert.doesNotMatch(site, /check (?:the )?expiry|check authenticity/i);
  assert.match(seo, /estimate its manufacture date and product age/);
  assert.match(seo, /separate typical unopened shelf-life and PAO guidance/);
  assert.doesNotMatch(seo, /guaranteed expiry|prove authenticity/i);
});

test("parameterized checker results are noindex with a stable canonical", () => {
  const checkPage = readFileSync("src/app/[locale]/check/page.tsx", "utf8");
  assert.match(checkPage, /searchParams:[^;]+brand\?: string; code\?: string/);
  assert.match(checkPage, /indexable: !\(query\.brand \|\| query\.code\)/);
  assert.match(checkPage, /path: "\/check"/);
});

test("brand directory copy and structured URLs follow every active locale", () => {
  const page = readFileSync("src/app/[locale]/brands/page.tsx", "utf8");
  for (const locale of LOCALE_CODES) {
    const copy = brandsDirectoryCopy(locale);
    assert.ok(copy.title.trim(), `${locale} lacks directory title`);
    assert.match(copy.description(BRANDS.length), new RegExp(String(BRANDS.length)));
    assert.match(copy.subtitle(BRANDS.length), new RegExp(String(BRANDS.length)));
    assert.doesNotMatch(copy.description(BRANDS.length), /\d+\+\s*(?:more)?/i);
  }
  assert.match(page, /localizedPath\(locale, `\/brands\/\$\{b\.slug\}`\)/);
  assert.match(page, /name: nav\("home"\)/);
  assert.match(page, /name: nav\("brands"\)/);
  assert.doesNotMatch(page, /All Supported Brands|BRANDS\.length\}\+|absoluteUrl\(`\/brands/);
});

test("English-only company and legal pages stay out of locale SEO exposure", () => {
  assert.deepEqual(ENGLISH_ONLY_LOCALES, ["en"]);
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  for (const route of ["about", "contact", "privacy", "terms"]) {
    const page = readFileSync(`src/app/[locale]/${route}/page.tsx`, "utf8");
    assert.match(page, /availableLocales: ENGLISH_ONLY_LOCALES/, route);
    assert.match(page, /indexable: locale === DEFAULT_LOCALE/, route);
    assert.match(
      sitemap,
      new RegExp(`entries\\("/${route}"[^\\n]+ENGLISH_ONLY_LOCALES\\)`),
      `${route} sitemap scope drifted`,
    );
  }
  const about = readFileSync("src/app/[locale]/about/page.tsx", "utf8");
  assert.doesNotMatch(about, /free, private|estimated expiration/i);
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
  // Path validation moved into `activity-path`; the route must delegate to it
  // rather than re-implementing a looser inline check.
  assert.match(activity, /normalizeActivityPath\(data\.path\)/);
  assert.equal(normalizeActivityPath("/check?utm_source=x"), null);
  assert.match(review, /Failed-code queue/);
  assert.match(review, /Approximate visits are anonymous browser sessions/);
  assert.match(photoForm, /focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(photoForm, /unresolved-code[\s\S]{0,500}scrollIntoView/);
});

test("failed checks offer truthful, measurement-ready recovery actions", () => {
  const resultCard = readFileSync("src/components/result-card.tsx", "utf8");
  const enCopy = readFileSync("messages/en.json", "utf8");
  const trCopy = readFileSync("messages/tr.json", "utf8");
  assert.match(enCopy, /Spaces and punctuation are already ignored/);
  assert.match(trCopy, /Boşluklar ve noktalama işaretleri zaten yok sayılır/);
  assert.doesNotMatch(enCopy, /Remove spaces or punctuation/);
  for (const action of ["retry-code", "submit-photos", "email-support"]) {
    assert.match(resultCard, new RegExp(`data-recovery-action="${action}"`));
  }
  assert.match(resultCard, /data-recovery-reason=\{reason\}/);
  assert.doesNotMatch(resultCard, /data-recovery-(?:email|ip|account|submission-id)/i);
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
    // Named, not blanket. These two publish an Inter Parfums long-form code as
    // their worked example, and that format is recognised but deliberately
    // undated — the decoder used to return a fabricated 2019 for it (finding
    // 51). An honest "we cannot date this yet" is better than a wrong date, but
    // it is still a weak page for an indexed, monetized brand, and listing them
    // here keeps that visible instead of letting the exception spread silently.
    const RECOGNISED_ONLY_SAMPLES = new Set(["montblanc", "dunhill"]);
    const attempt = decoder.decode(detail.sampleCode, { now });
    if (RECOGNISED_ONLY_SAMPLES.has(slug)) {
      assert.ok(attempt, `${slug} sample ${detail.sampleCode} is not even recognised`);
      assert.equal(attempt.manufactureDate, null, `${slug} now dates — remove it from the exception list`);
    } else {
      assert.ok(
        attempt?.manufactureDate,
        `${slug} sample ${detail.sampleCode} does not decode`,
      );
    }
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

test("the limiter stays bounded under a flood of distinct keys", () => {
  // The case that matters is many distinct keys inside one window: nothing has
  // expired, so sweeping expired buckets frees nothing. Before the ceiling was
  // enforced this grew without bound.
  const now = Date.now();
  for (let i = 0; i < 12_000; i++) checkRateLimit(`flood:${i}`, now);
  assert.ok(
    trackedKeyCount() <= MAX_TRACKED_KEYS,
    `limiter tracked ${trackedKeyCount()} keys, above the ${MAX_TRACKED_KEYS} ceiling`,
  );
  // The key recorded last must survive its own eviction pass, or a caller could
  // never be limited while the map is full.
  const last = checkRateLimit("flood:11999", now);
  assert.equal(last.limit, 30);
});

test("activity logging only accepts paths that resolve to a real page", () => {
  for (const good of [
    "/",
    "/check",
    "/brands",
    "/brands/loreal-paris",
    "/ru/brands/loreal-paris",
    "/guides/what-is-a-batch-code",
    "/decoders/coty-batch-code-format",
    "/privacy",
    "/brands/dior/",
  ]) {
    assert.ok(normalizeActivityPath(good), `${good} should be recordable`);
  }
  for (const bad of [
    "/not-a-section",
    "/brands/loreal-paris/extra",
    "/check/anything",
    "/brands/Not A Slug",
    "/review/dashboard",
    "/ru/review/dashboard",
    "//evil",
    "/check?utm_source=x",
    "/check#frag",
    `/brands/${"a".repeat(200)}`,
    "no-leading-slash",
    42,
  ]) {
    assert.equal(normalizeActivityPath(bad), null, `${String(bad)} should be rejected`);
  }
  // The locale prefix is preserved: the dashboard reports per locale.
  assert.equal(normalizeActivityPath("/ru/check"), "/ru/check");
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

test("generic metadata fitting respects Unicode title and description budgets", () => {
  const japanese = "製造日と化粧品のバッチコードを確認するための非常に長い説明です".repeat(4);
  assert.ok(snippetLength(fitSnippet(japanese, TITLE_BUDGET)) <= TITLE_BUDGET);
  assert.ok(snippetLength(fitSnippet("word ".repeat(80), DESCRIPTION_BUDGET)) <= DESCRIPTION_BUDGET);
  assert.match(fitSnippet("word ".repeat(80), DESCRIPTION_BUDGET), /…$/u);
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
      const fallback = {
        title: fitTitle(
          fill(brandPage.metaTitle),
          fill(brandPage.metaTitleShort),
        ),
        description: fill(brandPage.metaDescription),
      };
      const { title, description } = brandSnippet(locale, brand.slug, fallback);
      assert.ok(
        title.length <= TITLE_BUDGET,
        `${locale}/${brand.slug} title is ${title.length} chars: ${title}`,
      );
      assert.ok(
        description.length <= DESCRIPTION_BUDGET,
        `${locale}/${brand.slug} description is ${description.length} chars`,
      );
    }
  }
});

test("high-impression English brand snippets stay targeted and isolated", () => {
  const fallback = { title: "Generic title", description: "Generic description" };
  const loreal = brandSnippet("en", "loreal-paris", fallback);
  const kerastase = brandSnippet("en", "kerastase", fallback);

  assert.match(loreal.title, /^L'Oréal Paris Batch Code Checker/);
  assert.match(kerastase.title, /^Kérastase Batch Code Checker/);
  assert.match(loreal.description, /jar bases, tube crimps, bottles or labels/);
  assert.match(kerastase.description, /bottle base, under a jar or on a tube crimp/);
  assert.equal(brandSnippet("de", "loreal-paris", fallback), fallback);
  assert.equal(brandSnippet("en", "dior", fallback), fallback);
});

test("Dior product intent stays consolidated on the existing brand URL", () => {
  const dior = englishMessages.brandDetail?.dior;
  assert.match(dior?.faq4q ?? "", /Sauvage.*Dior Homme.*Miss Dior/);
  assert.match(dior?.faq4a ?? "", /manufacture date/);
  assert.match(dior?.faq4a ?? "", /cannot prove.*genuine/);

  for (const productSlug of ["sauvage", "dior-homme", "miss-dior"]) {
    assert.equal(
      existsSync(`src/app/[locale]/products/${productSlug}`),
      false,
      `product intent must not create /products/${productSlug}`,
    );
    assert.equal(
      existsSync(`src/app/[locale]/brands/dior/${productSlug}`),
      false,
      `product intent must not create /brands/dior/${productSlug}`,
    );
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
  // Baseline was 70 while the inventory carried 71. Six files were withdrawn on
  // 2026-07-20 because their CC BY-SA tags were doubtful (finding 20), so 65 is
  // the floor now — the point of the check is to catch a fetch silently losing
  // logos, not to stop a deliberate removal.
  assert.ok(Object.keys(inventory).length >= 65, "Wikidata logo coverage regressed below baseline");
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

test("photo assist uses bounded centered crops and rotation-aware output", () => {
  assert.deepEqual(photoTransformPlan(4000, 2000, 0, false), {
    sx: 0,
    sy: 0,
    sw: 4000,
    sh: 2000,
    drawWidth: 2000,
    drawHeight: 1000,
    canvasWidth: 2000,
    canvasHeight: 1000,
  });
  assert.deepEqual(photoTransformPlan(4000, 2000, 90, true), {
    sx: 1000,
    sy: 0,
    sw: 2000,
    sh: 2000,
    drawWidth: 2000,
    drawHeight: 2000,
    canvasWidth: 2000,
    canvasHeight: 2000,
  });
  assert.throws(() => photoTransformPlan(0, 2000, 0, false), /Invalid image dimensions/);
});

test("trend reports direction only against a real baseline", () => {
  const rows = [
    { ts: "2026-07-19T00:00:00.000Z" },
    { ts: "2026-07-18T00:00:00.000Z" },
    { ts: "2026-07-10T00:00:00.000Z" },
  ];
  const current = "2026-07-13T00:00:00.000Z";
  const previous = "2026-07-06T00:00:00.000Z";
  const t = trend(rows, current, previous);
  assert.equal(t.current, 2);
  assert.equal(t.previous, 1);
  assert.equal(t.changePercent, 100);

  // An empty earlier window has no rate; inventing one would read as growth.
  const noBaseline = trend([{ ts: "2026-07-19T00:00:00.000Z" }], current, previous);
  assert.equal(noBaseline.previous, 0);
  assert.equal(noBaseline.changePercent, null);

  // The predicate narrows both halves, not just the current one.
  const typed = trend(
    [
      { ts: "2026-07-19T00:00:00.000Z", type: "visit" },
      { ts: "2026-07-10T00:00:00.000Z", type: "visit" },
      { ts: "2026-07-10T00:00:00.000Z", type: "page_view" },
    ],
    current,
    previous,
    (row) => row.type === "visit",
  );
  assert.equal(typed.current, 1);
  assert.equal(typed.previous, 1);
  assert.equal(typed.changePercent, 0);
});

test("decoder health trend needs traffic on both sides before it claims a swing", () => {
  const current = "2026-07-13T00:00:00.000Z";
  const previous = "2026-07-06T00:00:00.000Z";
  const row = (brand: string, ts: string, mfg: string | null) =>
    ({ ts, brand, confidence: mfg ? "high" : "none", mfg });
  const checks = [
    // vichy: 0/3 failing before, 3/3 failing now — a real regression.
    row("vichy", "2026-07-08T00:00:00.000Z", "2025-01-15"),
    row("vichy", "2026-07-09T00:00:00.000Z", "2025-01-15"),
    row("vichy", "2026-07-10T00:00:00.000Z", "2025-01-15"),
    row("vichy", "2026-07-15T00:00:00.000Z", null),
    row("vichy", "2026-07-16T00:00:00.000Z", null),
    row("vichy", "2026-07-17T00:00:00.000Z", null),
    // dior: one check each side is not a trend.
    row("dior", "2026-07-08T00:00:00.000Z", "2025-01-15"),
    row("dior", "2026-07-15T00:00:00.000Z", null),
  ];
  const swings = decoderHealthTrend(checks, current, previous);
  assert.equal(swings.get("vichy"), 100, "a decoder that stopped reading must show the full swing");
  assert.equal(swings.get("dior"), null, "two checks cannot support a percentage-point claim");
});

test("review check filters compose and failed trends use the complete time window", () => {
  const page = readFileSync("src/app/[locale]/review/page.tsx", "utf8");
  assert.match(page, /name="brand" value=\{brandFilter\}/);
  assert.match(page, /name="country" value=\{countryFilter\}/);
  assert.match(page, /checksMatchingNonResultFilters\.filter\(matchesResult\)/);
  assert.match(page, /readFailedCodesSince\(windowReport\)/);
  assert.match(page, /attempts for this normalized code/);
});

/**
 * Permissiveness ceiling — the regression guard for finding 31.
 *
 * These strings are not batch codes. Any date produced from one is a confident
 * wrong answer of the kind that produced findings 22, 29 and 30, so the count is
 * pinned rather than merely observed: a change that makes a decoder hungrier
 * fails here instead of reaching users.
 *
 * The ceiling is not zero yet, and the remainder is deliberate. `1A2B3C` and
 * `7X8Y9Z` still satisfy the documented L'Oréal shape; tightening the factory
 * prefix from one digit to two would refuse them at the cost of two real codes
 * in the export (`2A100`, `4Z8K`) whose provenance is unconfirmed. Two-for-two
 * is not evidence worth spending. The rest sit in decoders whose formats are
 * short enough that a plausible date really is readable from a short string —
 * lowering those needs per-decoder evidence, not a blanket rule.
 */
test("decoders decline strings that are not batch codes", () => {
  const junk = [
    "ABC123", "XY9876", "A1B2C3", "HELLO1", "12345", "987654", "QQ0011",
    "ZZZ999", "TEST01", "1A2B3C", "000000", "555555", "AAA111", "M12345",
    "7X8Y9Z", "B4D5E6",
  ];
  const ids = Object.keys(DECODERS);
  const dated: string[] = [];
  for (const code of junk) {
    for (const id of ids) {
      const result = checkBatchCode({
        brandName: "test",
        code,
        decoderId: id,
        shelfLifeMonths: 60,
        category: "perfume",
      });
      if (result.decoded) dated.push(`${id}:${code}`);
    }
  }
  const CEILING = 29;
  assert.ok(
    dated.length <= CEILING,
    `decoders dated ${dated.length} junk inputs, above the ${CEILING} ceiling: ${dated.join(", ")}`,
  );

  // L'Oréal is pinned separately: it carries ~45 brands, more than any other
  // decoder, and its scanning fallback was the single largest source of these.
  const lorealDated = junk.filter(
    (code) => checkBatchCode({
      brandName: "test", code, decoderId: "loreal", shelfLifeMonths: 36, category: "skincare",
    }).decoded,
  );
  assert.ok(
    lorealDated.length <= 2,
    `loreal dated ${lorealDated.length} junk inputs (was 10 before finding 31): ${lorealDated.join(", ")}`,
  );
});

/** Codes whose shape we know but whose date we do not must say exactly that. */
test("unshaped L'Oréal codes are recognized rather than dated", () => {
  for (const code of ["E38Y801N", "MNX30W", "N295635", "14YZ300"]) {
    const result = checkBatchCode({
      brandName: "L'Oréal", code, decoderId: "loreal", shelfLifeMonths: 36, category: "skincare",
    });
    assert.equal(result.decoded, false, `${code} should not produce a date`);
    assert.equal(result.failureReason, "recognized", `${code} should be recognized`);
    assert.equal(result.manufactureDate, null);
  }
  // The documented shape still decodes, at full confidence.
  const good = checkBatchCode({
    brandName: "L'Oréal", code: "26X300", decoderId: "loreal", shelfLifeMonths: 36, category: "skincare",
  });
  assert.equal(good.decoded, true);
  assert.equal(good.confidence, "high");
});

/**
 * Advertising cannot ship ahead of the certified consent message.
 *
 * Production was loading `adsbygoogle.js` on every page with no `__tcfapi`
 * present anywhere, which is the third-party advertising processing an EEA, UK
 * or Swiss visitor has to be asked about first. Both the loader and the ad unit
 * now hang off the same flag, so neither can be switched on by setting slot ids
 * and forgetting the CMP. See finding 19.
 */
test("ad loader and ad units are gated on the certified CMP", () => {
  const loader = readFileSync("src/components/ui/adsense-loader.tsx", "utf8");
  const slot = readFileSync("src/components/ui/ad-slot.tsx", "utf8");

  assert.match(loader, /if \(!googleCmpEnabled\) return null;/);
  assert.doesNotMatch(
    loader,
    /if \(!adsense\.client\) return null;/,
    "the loader must not gate on the publisher id alone",
  );
  assert.match(slot, /googleCmpEnabled/);
  assert.match(
    slot,
    /const hasUnit = Boolean\(client && slot && googleCmpEnabled\)/,
    "ad units must require the CMP as well as a slot id",
  );

  // The flag itself must stay account-verified rather than implied by config.
  const ads = readFileSync("src/lib/ads.ts", "utf8");
  assert.match(ads, /NEXT_PUBLIC_GOOGLE_CMP_ENABLED === "true"/);

  // The privacy page has to describe what is deployed, in both states, since it
  // is what a reviewer reads to check the claim against the behaviour. Promising
  // a consent message the site does not serve — or omitting one it does — is a
  // false statement checkable in one click.
  // Whitespace-tolerant: the copy is JSX and wraps across lines.
  const privacy = readFileSync("src/app/[locale]/privacy/page.tsx", "utf8").replace(/\s+/g, " ");
  assert.match(privacy, /IAB Transparency and Consent Framework/);
  assert.match(privacy, /googleCmpEnabled \? \(/, "privacy copy must follow the deployed CMP state");
  assert.match(privacy, /Advertising is not currently enabled/, "the pre-CMP branch must say so plainly");
  assert.match(privacy, /reopen it at any time/, "the deployed branch must describe consent revocation");
});

test("production build config fails closed when the CMP stack is incomplete", () => {
  const script = "scripts/validate-build-env.sh";
  const valid = {
    NEXT_PUBLIC_SITE_URL: "https://cosmeticsbatch.com",
    REQUIRE_MONETIZATION_STACK: "true",
    NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-1234567890123456",
    NEXT_PUBLIC_GOOGLE_CMP_ENABLED: "true",
    NEXT_PUBLIC_GA_ID: "G-ABC123",
    NEXT_PUBLIC_YM_ID: "123456",
  };
  assert.equal(spawnSync("bash", [script], { env: { ...process.env, ...valid } }).status, 0);
  for (const [key, value] of [
    ["NEXT_PUBLIC_ADSENSE_CLIENT", ""],
    ["NEXT_PUBLIC_GOOGLE_CMP_ENABLED", "false"],
    ["NEXT_PUBLIC_GA_ID", ""],
    ["NEXT_PUBLIC_YM_ID", "not-a-number"],
  ] as const) {
    const result = spawnSync("bash", [script], {
      env: { ...process.env, ...valid, [key]: value },
    });
    assert.notEqual(result.status, 0, `${key} must fail a monetized production build`);
  }
  const adFree = spawnSync("bash", [script], {
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: "https://cosmeticsbatch.com",
      REQUIRE_MONETIZATION_STACK: "false",
      NEXT_PUBLIC_GOOGLE_CMP_ENABLED: "false",
    },
  });
  assert.equal(adFree.status, 0, "an explicitly ad-free build remains supported");
});

/**
 * Brand logos may not ship under a licence we are not honouring.
 *
 * The inventory records the Commons licence per file so this can be checked
 * rather than assumed, and so a re-fetch that swaps a public-domain file for a
 * licensed one fails here instead of shipping. See finding 20.
 *
 * The list is explicit rather than computed: adding a logo that needs
 * attribution should be a decision someone writes down, not something that
 * slips in because a script found a file.
 */
test("brand logos are public domain, or explicitly accounted for", () => {
  const inventory = getBrandLogoInventory();
  const slugs = Object.keys(inventory);
  assert.ok(slugs.length > 0, "no brand logos in the inventory");

  for (const [slug, logo] of Object.entries(inventory)) {
    assert.ok(logo.licence, `${slug} has no recorded licence — rerun scripts/fetch-brand-logo-licences.mjs`);
  }

  // The six files whose CC BY-SA tags were doubtful — each the brand's own mark
  // uploaded by someone who did not hold the rights — were removed on
  // 2026-07-20 and now render as typographic tiles. Nothing we ship should
  // require attribution: if this list grows, a licensed file got in.
  assert.deepEqual(
    logosRequiringAttribution(),
    [],
    "a logo now requires attribution — review it against finding 20 before shipping",
  );
  for (const licence of Object.values(inventory).map((logo) => logo.licence)) {
    assert.ok(
      ATTRIBUTION_FREE_LICENCES.has(licence ?? ""),
      `a logo ships under "${licence}", which is not attribution-free`,
    );
  }
});

/** Every brand shows something designed, not bare initials on white. */
test("every brand resolves to a logo or a tile", () => {
  for (const brand of ALL_BRANDS) {
    const tile = brandTile(brand.slug, brand.name);
    assert.ok(tile.label.length > 0, `${brand.slug} produced an empty tile label`);
    // Curated labels are hand-set and the wordmark SVG squeezes them to fit
    // ("MAYBELLINE" is deliberate). The generator is what needs a ceiling.
    const limit = getBrandTile(brand.slug) ? 12 : 9;
    assert.ok(
      tile.label.length <= limit,
      `${brand.slug} tile label "${tile.label}" is too long to read`,
    );
    assert.match(tile.bg, /^#[0-9a-f]{6}$/i, `${brand.slug} tile has no usable background`);
  }
  // Deterministic: a brand keeps its colour between deploys.
  const first = brandTile("cosrx", "COSRX");
  assert.deepEqual(brandTile("cosrx", "COSRX"), first);
});

/**
 * A brand that prints a readable date must say so when a decode fails.
 *
 * `printsDate` was already recorded per brand and shown on the brand page, but
 * it never reached the person who had just been told their code was unreadable.
 * That was the entire failure for two brands — Skin1004 and Beauty of Joseon
 * returned no date on every logged check — and 41 of the 46 K-beauty brands
 * carry the same flag. There is no decoder to write: the date is on the pack.
 */
test("failed checks on date-printing brands point at the printed date", () => {
  for (const slug of ["skin1004", "beauty-of-joseon", "cosrx", "hada-labo"]) {
    const brand = ALL_BRANDS.find((entry) => entry.slug === slug);
    assert.ok(brand, `${slug} is missing from the catalog`);
    assert.equal(brand.printsDate, true, `${slug} should be flagged as printing a date`);
    assert.equal(printsDateHintKey(brand.printsDate), "printsDate", `${slug} must offer the hint`);
  }
  // Brands that encode a date must not be told to go looking for a printed one.
  for (const slug of ["dior", "chanel", "loreal-paris"]) {
    const brand = ALL_BRANDS.find((entry) => entry.slug === slug);
    assert.equal(printsDateHintKey(brand?.printsDate), null, `${slug} should not offer the hint`);
  }
  // The failure card has to render it, above the address hint.
  const card = readFileSync("src/components/result-card.tsx", "utf8");
  assert.match(card, /printsDateHintKey\(brand\.printsDate\)/);
  // The words themselves moved into the catalogs, so every active locale must
  // own the complete namespace instead of silently inheriting English.
  const flattenFailure = (value: Record<string, unknown>, prefix = ""): Record<string, string> =>
    Object.fromEntries(Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return child && typeof child === "object"
        ? Object.entries(flattenFailure(child as Record<string, unknown>, path))
        : [[path, String(child)]];
    }));
  const placeholders = (value: string) => [...value.matchAll(/\{[^}]+\}/g)].map(([match]) => match).sort();
  const source = flattenFailure((JSON.parse(readFileSync("messages/en.json", "utf8")) as {
    resultFailure: Record<string, unknown>;
  }).resultFailure);
  for (const locale of LOCALE_CODES) {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as {
      resultFailure?: Record<string, unknown>;
    };
    assert.ok(messages.resultFailure, `${locale} is missing its owned resultFailure namespace`);
    const localized = flattenFailure(messages.resultFailure);
    assert.deepEqual(Object.keys(localized).sort(), Object.keys(source).sort(), `${locale} failure-copy keys drifted`);
    for (const [key, value] of Object.entries(localized)) {
      assert.deepEqual(placeholders(value), placeholders(source[key]), `${locale}:${key} placeholders drifted`);
    }
    assert.doesNotMatch(
      localized["reason.recognized.body"],
      /\bgenuine\b|\bauthentic(?:ity)?\b/i,
      `${locale} recognized-format copy must not claim authenticity`,
    );
  }
  const translator = readFileSync("scripts/translate-mt.mjs", "utf8");
  assert.doesNotMatch(translator, /new RegExp\(`\\\\s\*x/, "placeholder restore must preserve surrounding spaces");
  assert.ok(
    card.indexOf("readableDateHint &&") < card.indexOf("addressHint &&"),
    "the printed-date hint must come before the address hint",
  );
});

/**
 * Article references on a Eucerin pack are not batch codes.
 *
 * A real session from Bulgaria on 2026-07-20 worked through eight strings off
 * one pack — the product name, two article references, and fragments of them.
 * Seven were correctly refused; `139602005` was read as a year and a week and
 * the user was told their product had expired in 2021. Beiersdorf codes are a
 * 6-8 digit run, so a nine-digit reference is not one. See finding 39.
 */
test("Beiersdorf refuses pack references that are not batch codes", () => {
  const refused = ["MEGA", "D-20245", "87997", "AE.04", "87997.000.AE.04", "139602005"];
  for (const code of refused) {
    const result = checkBatchCode({
      brandName: "Eucerin", code, decoderId: "beiersdorf", shelfLifeMonths: 36, category: "skincare",
    });
    assert.equal(result.decoded, false, `${code} should not produce a date`);
  }
  // The documented shape still reads, with and without the trailing letters.
  for (const code of ["44736976", "8153554", "63450108CZ"]) {
    const result = checkBatchCode({
      brandName: "Eucerin", code, decoderId: "beiersdorf", shelfLifeMonths: 36, category: "skincare",
    });
    assert.equal(result.decoded, true, `${code} should still decode`);
  }
});

/**
 * The visible lists show the selected period, not the comparison window.
 *
 * The dashboard fetches two periods deep so the trend arrows have a baseline.
 * Pointing a rendered list at that raw array shows twice the range the heading
 * claims — selecting "Today" listed yesterday's checks underneath today's, and
 * the log never restarted at midnight. See finding 47.
 */
test("review lists read the selected window, not the raw fetch", () => {
  const page = readFileSync("src/app/[locale]/review/page.tsx", "utf8");

  // The wider fetch may only feed the trend comparisons, which need both halves.
  assert.match(page, /const checksMatchingNonResultFilters = checksWindow/);
  assert.match(page, /const failedFiltered = failedWindow\.filter/);
  assert.match(page, /Failed-code queue \(\{failedWindow\.length\}\)/);

  // Filter options have to come from the window too, or a pick returns nothing.
  assert.match(page, /const checkBrands = \[\.\.\.new Set\(checksWindow\.map/);
  assert.match(page, /const checkCountries = \[\.\.\.new Set\(checksWindow\.map/);
  // The attempt badge counts attempts within the window it is displayed in.
  assert.match(page, /for \(const row of checksWindow\) \{/);

  // decoderHealthTrend is the deliberate exception: it compares two periods.
  assert.match(page, /decoderHealthTrend\(checks, window7d, window14d\)/);
});

/**
 * "LOT" is a label printed beside the code, not part of it.
 *
 * Packs print "LOT 54Z82X" and people copy the line as they see it. That cost
 * the read: `LOT54Z82X` returned nothing while `54Z82X` decoded. The remainder
 * must contain a digit, or "LOTUS" would be truncated to "US". See finding 48.
 */
test("a printed LOT label does not break the code", () => {
  const read = (code: string) => checkBatchCode({
    brandName: "CeraVe", code, decoderId: "loreal", shelfLifeMonths: 36, category: "skincare",
  });
  const bare = read("54Z82X");
  assert.equal(bare.decoded, true, "the bare code should decode");
  for (const prefixed of ["LOT54Z82X", "LOT 54Z82X", "LOT-54Z82X", "lot 54z82x", "BATCH 54Z82X"]) {
    const result = read(prefixed);
    assert.equal(result.decoded, true, `${prefixed} should decode`);
    assert.deepEqual(result.manufactureDate, bare.manufactureDate, `${prefixed} should match the bare code`);
  }
  // Words that merely start with the same letters keep every character.
  for (const word of ["LOTUS", "LOTION", "LOT"]) {
    assert.equal(canonicalCode(word), word, `${word} must not be truncated`);
  }
});

/**
 * Inter Parfums bottles carry a long code we cannot date, and must not pretend.
 *
 * Eight real codes — six photographed, two from user checks — share a shape the
 * documented short format does not describe. The unanchored match read them
 * anyway, taking any letter as the year and the last three characters as a day,
 * and returned 2011 for bottles whose packaging is current. See finding 51.
 */
test("Inter Parfums long codes are recognized, not dated", () => {
  const read = (code: string) => checkBatchCode({
    brandName: "Jimmy Choo", code, decoderId: "interparfums", shelfLifeMonths: 60, category: "perfume",
  });
  for (const code of ["AFR42R261", "ADR20R091", "AFS07S005", "AER44R276", "CES07R363", "08N46N257A"]) {
    const result = read(code);
    assert.equal(result.decoded, false, `${code} must not produce a date`);
    assert.equal(result.failureReason, "recognized", `${code} should be recognized`);
  }
  // The documented short form still reads.
  assert.equal(read("K123").decoded, true, "the short form should still decode");
});
