#!/usr/bin/env node

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = join(process.cwd(), "data", "search-performance");
const normalizedRoot = join(root, "normalized");
const sourcesText = readFileSync(join(root, "SOURCES.md"), "utf8");
const findingsText = readFileSync(join(root, "FINDINGS.md"), "utf8");
const sourceIdPattern = /^[A-Z0-9][A-Z0-9-]{2,79}$/;
const shaPattern = /^[a-f0-9]{64}$/;
const forbiddenHeaders = /^(?:e-?mail|email_address|ip|ip_address|account|account_id|user_id|submission|submission_id|name)$/i;

function parseTsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === "\t") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  assert.equal(quoted, false, "TSV ends inside a quoted field");
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

const sourceIds = readdirSync(normalizedRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.ok(sourceIds.length > 0, "no normalized search-performance sources");
assert.equal(new Set(sourceIds).size, sourceIds.length, "duplicate source IDs");

for (const sourceId of sourceIds) {
  assert.match(sourceId, sourceIdPattern, `unsafe source ID: ${sourceId}`);
  const directory = join(normalizedRoot, sourceId);
  const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8"));
  assert.equal(manifest.source_id, sourceId, `${sourceId}: manifest ID drift`);
  assert.match(manifest.sha256, shaPattern, `${sourceId}: invalid SHA-256`);
  assert.match(sourcesText, new RegExp(`\\| ${sourceId.replaceAll("-", "\\-")} \\|`), `${sourceId}: absent from SOURCES.md`);
  assert.ok(sourcesText.includes(manifest.sha256), `${sourceId}: hash absent from SOURCES.md`);

  const expectedFiles = new Set(["manifest.json"]);
  const sheetNames = new Set();
  for (const sheet of manifest.sheets) {
    assert.ok(!sheetNames.has(sheet.sheet), `${sourceId}: duplicate sheet ${sheet.sheet}`);
    sheetNames.add(sheet.sheet);
    assert.equal(basename(sheet.file), sheet.file, `${sourceId}: unsafe sheet path`);
    assert.ok(sheet.file.endsWith(".tsv"), `${sourceId}: sheet is not TSV`);
    expectedFiles.add(sheet.file);
    const rows = parseTsv(readFileSync(join(directory, sheet.file), "utf8"));
    assert.equal(rows.length, sheet.rows_including_header, `${sourceId}/${sheet.file}: row drift`);
    assert.equal(Math.max(0, ...rows.map((row) => row.length)), sheet.columns, `${sourceId}/${sheet.file}: column drift`);
    for (const header of rows[0] ?? []) {
      assert.doesNotMatch(header.trim(), forbiddenHeaders, `${sourceId}/${sheet.file}: private-data column ${header}`);
    }
  }
  assert.deepEqual(
    new Set(readdirSync(directory)),
    expectedFiles,
    `${sourceId}: normalized files differ from manifest`,
  );
}

const claimIds = [...findingsText.matchAll(/^\| ([A-Z0-9-]+) \|/gm)].map((match) => match[1]);
assert.equal(new Set(claimIds).size, claimIds.length, "duplicate finding claim IDs");
for (const sourceId of findingsText.matchAll(/`((?:GSC|WEBMASTER)-\d{4}-\d{2}-\d{2}-\d{2})`/g)) {
  assert.ok(sourceIds.includes(sourceId[1]), `finding references unknown source: ${sourceId[1]}`);
}

console.log(`search-performance evidence valid: ${sourceIds.length} sources, ${claimIds.length} claims`);
