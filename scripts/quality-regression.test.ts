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
import { DECODERS } from "../src/lib/decoder";
import { LOCALE_CODES } from "../src/i18n/locales";
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

test("publishing policy limits search exposure to 15 locales and 50 brands", () => {
  assert.equal(INDEXABLE_LOCALES.length, 15);
  assert.equal(new Set(INDEXABLE_LOCALES).size, 15);
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

test("reviewed Russian brand-page copy has no known English fallback leak", () => {
  const russian = JSON.parse(readFileSync("messages/ru.json", "utf8")) as {
    brandPage: Record<string, string>;
  };
  for (const [key, value] of Object.entries(russian.brandPage)) {
    assert.doesNotMatch(value, /Once we read|You'll sometimes see|No sign-up/i, key);
  }
});

test("photo review flow has complete copy for every active locale", () => {
  assert.deepEqual([...PHOTO_SUBMISSION_LOCALES].sort(), [...LOCALE_CODES].sort());
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
