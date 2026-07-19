#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("src/lib/brands.ts", "utf8");
const block = source.match(/const CODE_IMAGES:[\s\S]*?= \{([\s\S]*?)\n\};\n\nconst BRAND_THEMES/)?.[1];
assert.ok(block, "CODE_IMAGES block missing");
const records = [];
let currentSlug;
for (const line of block.split("\n")) {
  const brand = line.match(/^  (?:(?:"([a-z0-9-]+)")|([a-z0-9-]+)): \[$/);
  if (brand) currentSlug = brand[1] ?? brand[2];
  const image = line.match(/src: "([^"]+)", width: (\d+), height: (\d+)/);
  if (!image) continue;
  assert.ok(currentSlug, `image has no brand: ${image[1]}`);
  records.push({
    id: `${currentSlug}-${records.filter((row) => row.brand === currentSlug).length + 1}`,
    brand: currentSlug,
    publicPath: image[1],
    width: Number(image[2]),
    height: Number(image[3]),
    sourceType: "needs-verification",
    sourceReference: null,
    permissionStatus: "needs-verification",
    privacyReview: "needs-verification",
    decoderRelevance: "needs-verification",
    reviewedByRole: null,
    reviewedAt: null,
    publicationState: "existing-public-audit-required",
  });
}
writeFileSync("data/evidence-inventory.json", `${JSON.stringify({ generatedFrom: "src/lib/brands.ts#CODE_IMAGES", records }, null, 2)}\n`);
console.log(`evidence inventory written: ${records.length} assets`);
