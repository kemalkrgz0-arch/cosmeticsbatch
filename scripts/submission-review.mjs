#!/usr/bin/env node

import { appendFile, open, readFile, unlink } from "node:fs/promises";
import { join } from "node:path";

const DIR = process.env.SUBMISSIONS_DIR || "/tmp/cosmeticsbatch-submissions";
const QUEUE = join(DIR, "submissions.jsonl");
const LOCK = join(DIR, ".review.lock");
const STATUSES = new Set(["pending", "in_review", "awaiting_user", "completed", "discarded"]);
const OUTCOMES = new Set(["identified", "unverifiable"]);
const TRANSITIONS = {
  pending: new Set(["in_review", "discarded"]),
  in_review: new Set(["awaiting_user", "completed", "discarded"]),
  awaiting_user: new Set(["in_review", "completed", "discarded"]),
  completed: new Set(),
  discarded: new Set(),
};

function usage(exitCode = 0) {
  console.log(`Usage:
  pnpm review:submissions list [--status pending]
  pnpm review:submissions show <submission-id>
  pnpm review:submissions status <submission-id> <status> [--outcome identified|unverifiable] [--note "short note"]

Statuses: pending, in_review, awaiting_user, completed, discarded
Replies stay in the original contact@ mailbox thread; this tool records workflow state only.`);
  process.exit(exitCode);
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function events() {
  let source;
  try {
    source = await readFile(QUEUE, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const lines = source.split("\n");
  const parsed = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;
    try {
      parsed.push(JSON.parse(line));
    } catch {
      // A crash can truncate only the final append. Refuse corruption in the
      // middle of the ledger but keep the intact history usable.
      if (index !== lines.length - 1) throw new Error(`Malformed queue event at line ${index + 1}`);
      console.error(`Warning: ignored truncated final event at line ${index + 1}`);
    }
  }
  return parsed;
}

function fold(allEvents) {
  const records = new Map();
  for (const event of allEvents) {
    if (!event?.id) continue;
    if (event.type === "submission") {
      if (records.has(event.id)) throw new Error(`Duplicate submission id: ${event.id}`);
      records.set(event.id, { ...event, revision: 0, notifications: [] });
      continue;
    }
    const record = records.get(event.id);
    if (!record) continue;
    if (event.type === "notification") record.notifications.push(event);
    if (event.type === "review") {
      record.status = event.status;
      record.outcome = event.outcome;
      record.reviewNote = event.note;
      record.reviewedAt = event.ts;
      record.revision += 1;
    }
  }
  return records;
}

function displayList(records, status) {
  const rows = [...records.values()]
    .filter((record) => !status || record.status === status)
    .sort((a, b) => b.ts.localeCompare(a.ts));
  if (rows.length === 0) return console.log("No matching submissions.");
  for (const record of rows) {
    const notification = record.notifications.at(-1)?.status ?? "missing";
    console.log(`${record.id}\t${record.status}\t${record.brand}\tmail:${notification}\t${record.ts}`);
  }
}

function displayOne(record) {
  if (!record) throw new Error("Submission not found");
  console.log(JSON.stringify({
    id: record.id,
    status: record.status,
    revision: record.revision,
    submittedAt: record.ts,
    brand: record.brand,
    code: record.code || null,
    note: record.note || null,
    replyEmail: record.email,
    storedFile: record.file,
    notification: record.notifications.at(-1)?.status ?? "missing",
    outcome: record.outcome ?? null,
    reviewNote: record.reviewNote ?? null,
    reviewedAt: record.reviewedAt ?? null,
  }, null, 2));
}

async function withLock(action) {
  let handle;
  try {
    handle = await open(LOCK, "wx", 0o600);
  } catch (error) {
    if (error?.code === "EEXIST") throw new Error("Another review update is in progress");
    throw error;
  }
  try {
    return await action();
  } finally {
    await handle.close();
    await unlink(LOCK).catch(() => {});
  }
}

async function updateStatus(id, nextStatus) {
  if (!STATUSES.has(nextStatus)) throw new Error(`Unknown status: ${nextStatus}`);
  const outcome = option("--outcome");
  const note = option("--note")?.trim().slice(0, 300);
  if (outcome && !OUTCOMES.has(outcome)) throw new Error(`Unknown outcome: ${outcome}`);
  if (nextStatus === "completed" && !outcome) {
    throw new Error("Completed reviews require --outcome identified|unverifiable");
  }
  if (nextStatus !== "completed" && outcome) {
    throw new Error("--outcome is valid only with completed status");
  }

  await withLock(async () => {
    const records = fold(await events());
    const record = records.get(id);
    if (!record) throw new Error("Submission not found");
    if (!TRANSITIONS[record.status]?.has(nextStatus)) {
      throw new Error(`Invalid transition: ${record.status} -> ${nextStatus}`);
    }
    const event = {
      type: "review",
      id,
      ts: new Date().toISOString(),
      status: nextStatus,
      revision: record.revision + 1,
      actor: process.env.REVIEWER_NAME || "owner-cli",
      ...(outcome ? { outcome } : {}),
      ...(note ? { note } : {}),
    };
    await appendFile(QUEUE, `${JSON.stringify(event)}\n`, { encoding: "utf8", mode: 0o600 });
    console.log(`${id}: ${record.status} -> ${nextStatus}`);
  });
}

const [command, first, second] = process.argv.slice(2);
try {
  if (!command || command === "--help" || command === "help") usage();
  const records = fold(await events());
  if (command === "list") {
    const status = option("--status");
    if (status && !STATUSES.has(status)) throw new Error(`Unknown status: ${status}`);
    displayList(records, status);
  } else if (command === "show" && first) {
    displayOne(records.get(first));
  } else if (command === "status" && first && second) {
    await updateStatus(first, second);
  } else {
    usage(1);
  }
} catch (error) {
  console.error(`Review command failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exit(1);
}
