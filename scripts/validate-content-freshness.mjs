#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const before = readFileSync("data/content-freshness.json", "utf8");
execFileSync(process.execPath, ["scripts/build-content-freshness.mjs"], { stdio: "pipe" });
const after = readFileSync("data/content-freshness.json", "utf8");
assert.equal(after, before, "content freshness manifest drift; run npm run content:freshness");

const manifest = JSON.parse(after);
const today = "2026-07-19";
const slugs = new Set();
assert.equal(manifest.policy?.nativeReviewMustBeExplicit, true);
for (const brand of manifest.brands) {
  assert.match(brand.slug, /^[a-z0-9-]+$/);
  assert.ok(!slugs.has(brand.slug), `duplicate freshness brand: ${brand.slug}`);
  slugs.add(brand.slug);
  assert.match(brand.lastEditorialReview, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(brand.lastEditorialReview <= today, `${brand.slug}: future editorial date`);
  assert.ok(brand.decoderVerification === "needs-verification", `${brand.slug}: unsupported decoder verification claim`);
  assert.ok(Number.isInteger(brand.evidenceCount) && brand.evidenceCount >= 0);
  assert.equal(brand.evidenceStatus, brand.evidenceCount ? "partial" : "missing");
  assert.deepEqual(brand.reviewedLocales, ["en", "ru"], `${brand.slug}: reviewed locale drift`);
  assert.equal(brand.responsibleRole, "editorial-owner");
  assert.equal(brand.nextReviewDate, null);
  assert.equal(brand.nextReviewState, "review-required");
}
assert.equal(slugs.size, 26, "freshness manifest must cover all 26 passing brands");
console.log(`content freshness valid: ${slugs.size} brands`);
