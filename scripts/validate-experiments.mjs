#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const path = "data/experiments/registry.json";
const registry = JSON.parse(readFileSync(path, "utf8"));
assert.ok(Array.isArray(registry) && registry.length > 0, "experiment registry is empty");

const ids = new Set();
const allowedStates = new Set(["planned", "local", "released", "measured"]);
const allowedDecisions = new Set(["pending", "keep", "revise", "revert"]);
const privateKey = /email|e-?mail|ip(?:Address|_address)?|account|submission|rawCode|checkedCode/i;

for (const experiment of registry) {
  assert.match(experiment.id, /^[A-Z0-9][A-Z0-9-]{7,100}$/, "invalid experiment ID");
  assert.ok(!ids.has(experiment.id), `duplicate experiment ID: ${experiment.id}`);
  ids.add(experiment.id);
  assert.match(experiment.owner, /^[a-z0-9-]+$/, `${experiment.id}: invalid owner`);
  assert.ok(allowedStates.has(experiment.state), `${experiment.id}: invalid state`);
  assert.ok(allowedDecisions.has(experiment.decision), `${experiment.id}: invalid decision`);
  assert.ok(Array.isArray(experiment.urls) && experiment.urls.length > 0, `${experiment.id}: URLs missing`);
  assert.equal(new Set(experiment.urls).size, experiment.urls.length, `${experiment.id}: duplicate URL`);
  for (const url of experiment.urls) {
    assert.match(url, /^\/(?!\/)[a-z0-9][a-z0-9/-]*$/, `${experiment.id}: invalid relative URL`);
    assert.doesNotMatch(url, /[?#]/, `${experiment.id}: URL contains query or fragment`);
  }
  if (experiment.urlPolicy === "existing-brand-only-no-product-url") {
    for (const url of experiment.urls) {
      assert.match(url, /^\/brands\/[a-z0-9-]+$/, `${experiment.id}: product/nested URL forbidden`);
    }
  }
  assert.match(experiment.source, /^(?:GSC|WEBMASTER)-\d{4}-\d{2}-\d{2}-\d{2}$/, `${experiment.id}: invalid source`);
  assert.ok(experiment.baseline?.periodFilter, `${experiment.id}: baseline period missing`);
  assert.ok(Array.isArray(experiment.baseline?.metrics) && experiment.baseline.metrics.length > 0, `${experiment.id}: baseline metrics missing`);
  assert.ok(experiment.hypothesis && experiment.primaryMetric, `${experiment.id}: hypothesis/primary metric missing`);
  assert.ok(Array.isArray(experiment.guardrails) && experiment.guardrails.length > 0, `${experiment.id}: guardrails missing`);
  assert.ok(Array.isArray(experiment.changedFiles) && experiment.changedFiles.length > 0, `${experiment.id}: changed files missing`);

  if (experiment.state === "planned" || experiment.state === "local") {
    assert.equal(experiment.release, null, `${experiment.id}: unreleased work has release metadata`);
    assert.equal(experiment.followUp14d, null, `${experiment.id}: unreleased work has 14-day outcome`);
    assert.equal(experiment.followUp28d, null, `${experiment.id}: unreleased work has 28-day outcome`);
    assert.equal(experiment.decision, "pending", `${experiment.id}: unreleased work has a decision`);
  } else {
    assert.match(experiment.release?.commit ?? "", /^[a-f0-9]{7,40}$/, `${experiment.id}: release commit missing`);
    assert.match(experiment.release?.date ?? "", /^\d{4}-\d{2}-\d{2}$/, `${experiment.id}: release date missing`);
  }

  const serialized = JSON.stringify(experiment);
  for (const key of Object.keys(experiment)) {
    assert.doesNotMatch(key, privateKey, `${experiment.id}: private-data key ${key}`);
  }
  assert.doesNotMatch(serialized, /@[a-z0-9.-]+\.[a-z]{2,}/i, `${experiment.id}: email-like value forbidden`);
}

console.log(`experiment registry valid: ${registry.length} experiments`);
