#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const matrix = readFileSync("docs/BRAND_QUALITY_MATRIX.md", "utf8");
const brandsSource = readFileSync("src/lib/brands.ts", "utf8");
const reviewedDate = matrix.match(/^Last reviewed: (\d{4}-\d{2}-\d{2})$/m)?.[1];
assert.ok(reviewedDate, "brand matrix review date missing");

const slug = (name) => name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/['".]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const catalogNames = new Set(
  [...brandsSource.matchAll(/^ {2}\["([^"]+)",/gm)].map((match) => match[1]),
);
const passing = matrix.match(/## Passing group — \d+\n([\s\S]*?)\n## Blocked group/)?.[1];
assert.ok(passing, "passing brand matrix section missing");

const brands = passing.split("\n")
  .filter((line) => /^\| [^|-]/.test(line))
  .slice(1)
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
  .map(([name, decoder, sample, images, currentIndex, remainingGap]) => {
    assert.ok(catalogNames.has(name), `unknown passing brand: ${name}`);
    const brandSlug = slug(name);
    const evidenceCount = Number(images);
    assert.ok(Number.isInteger(evidenceCount) && evidenceCount >= 0, `${brandSlug}: invalid image count`);
    return {
      slug: brandSlug,
      name,
      lastEditorialReview: reviewedDate,
      decoderVerification: "needs-verification",
      evidenceCount,
      evidenceStatus: evidenceCount > 0 ? "partial" : "missing",
      reviewedLocales: currentIndex.split(",").map((locale) => locale.trim().toLowerCase()),
      responsibleRole: "editorial-owner",
      nextReviewDate: null,
      nextReviewState: "review-required",
      remainingGap,
      decoder,
      sample: sample.replaceAll("`", ""),
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const manifest = {
  generatedFrom: "docs/BRAND_QUALITY_MATRIX.md",
  sourceReviewedAt: reviewedDate,
  policy: {
    unknownFacts: "needs-verification",
    staleAction: "review-queue-not-auto-remove",
    nativeReviewMustBeExplicit: true,
  },
  brands,
};
writeFileSync("data/content-freshness.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`content freshness written: ${brands.length} passing brands`);
