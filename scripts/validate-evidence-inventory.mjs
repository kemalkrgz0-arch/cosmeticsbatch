#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const file = "data/evidence-inventory.json";
const before = readFileSync(file, "utf8");
execFileSync(process.execPath, ["scripts/build-evidence-inventory.mjs"], { stdio: "pipe" });
const after = readFileSync(file, "utf8");
assert.equal(after, before, "evidence inventory drift; run npm run evidence:inventory");
const inventory = JSON.parse(after);
const ids = new Set();
for (const record of inventory.records) {
  assert.ok(!ids.has(record.id), `duplicate evidence ID: ${record.id}`);
  ids.add(record.id);
  assert.match(record.brand, /^[a-z0-9-]+$/);
  assert.match(record.publicPath, /^\/brands\/(?:examples\/)?[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/);
  assert.ok(existsSync(`public${record.publicPath}`), `missing evidence asset: ${record.publicPath}`);
  assert.ok(record.width > 0 && record.height > 0);
  assert.equal(record.sourceType, "needs-verification");
  assert.equal(record.sourceReference, null);
  assert.equal(record.permissionStatus, "needs-verification");
  assert.equal(record.privacyReview, "needs-verification");
  assert.equal(record.decoderRelevance, "needs-verification");
  assert.equal(record.publicationState, "existing-public-audit-required");
  assert.doesNotMatch(JSON.stringify(record), /email|submissionNote|privatePath|ipAddress/i);
}
assert.ok(ids.size > 0, "evidence inventory empty");
console.log(`evidence inventory valid: ${ids.size} assets require provenance audit`);
