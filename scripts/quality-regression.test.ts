import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
import { getBrandDomain } from "../src/lib/brand-logos";

const englishMessages = JSON.parse(
  readFileSync("messages/en.json", "utf8"),
) as { brandDetail?: Record<string, Record<string, string>> };
const englishContent = JSON.parse(
  readFileSync("messages/content/en.json", "utf8"),
) as Record<string, string>;
const reviewedContent = JSON.parse(
  readFileSync("messages/content/reviewed.json", "utf8"),
) as Record<string, string[]>;

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
  assert.deepEqual(
    new Set(reviewedContent.ru ?? []),
    sourceKeys,
    "Russian is declared reviewed but does not cover the complete source corpus",
  );
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

test("brand logo inventory only omits discontinued licensed lines without an official site", () => {
  const intentionallyUnmapped = new Set([
    "beyonce",
    "enrique-iglesias",
    "jovan",
    "katy-perry",
    "nikos",
    "sjp",
  ]);
  const unmapped = BRANDS.filter((brand) => !getBrandDomain(brand.slug)).map(
    (brand) => brand.slug,
  );
  assert.deepEqual(unmapped.sort(), [...intentionallyUnmapped].sort());
  for (const brand of BRANDS) {
    const domain = getBrandDomain(brand.slug);
    if (!domain) continue;
    assert.match(domain, /^[a-z0-9.-]+$/i, `${brand.slug} has an invalid logo domain`);
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
