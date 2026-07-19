import { appendFile, open, readFile, unlink } from "node:fs/promises";
import { isAbsolute, join, normalize, resolve, sep } from "node:path";

export const SUBMISSIONS_DIR = process.env.SUBMISSIONS_DIR || "/tmp/cosmeticsbatch-submissions";
// Runtime-only bind-mounted data must never be followed into the standalone
// build trace. The directory is validated again before any image read.
const QUEUE = join(/* turbopackIgnore: true */ SUBMISSIONS_DIR, "submissions.jsonl");
const LOCK = join(/* turbopackIgnore: true */ SUBMISSIONS_DIR, ".review.lock");

export const REVIEW_STATUSES = ["pending", "in_review", "awaiting_user", "completed", "discarded"] as const;
export type ReviewStatus = typeof REVIEW_STATUSES[number];
export type ReviewOutcome = "identified" | "unverifiable";

type Event = Record<string, unknown> & { type?: string; id?: string; ts?: string };
export type Submission = {
  id: string;
  ts: string;
  brand: string;
  code: string;
  note: string;
  email: string;
  file: string;
  files?: string[];
  status: ReviewStatus;
  revision: number;
  outcome?: ReviewOutcome;
  reviewNote?: string;
  reviewedAt?: string;
  replyStatus?: string;
  notificationStatus?: string;
  notificationReason?: string;
};

async function events() {
  let source: string;
  try {
    source = await readFile(QUEUE, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const lines = source.split("\n");
  return lines.flatMap((line, index) => {
    if (!line.trim()) return [];
    try { return [JSON.parse(line) as Event]; } catch {
      if (index === lines.length - 1) return [];
      throw new Error(`Malformed submission ledger at line ${index + 1}`);
    }
  });
}

export async function listSubmissions() {
  const records = new Map<string, Submission>();
  for (const event of await events()) {
    if (!event.id) continue;
    if (event.type === "submission") {
      records.set(event.id, { ...event, revision: 0 } as unknown as Submission);
    } else {
      const record = records.get(event.id);
      if (!record) continue;
      if (event.type === "review") {
        record.status = event.status as ReviewStatus;
        record.outcome = event.outcome as ReviewOutcome | undefined;
        record.reviewNote = event.note as string | undefined;
        record.reviewedAt = event.ts;
        record.revision += 1;
      }
      if (event.type === "reply") record.replyStatus = event.status as string;
      if (event.type === "notification") {
        record.notificationStatus = event.status as string;
        record.notificationReason = event.reason as string | undefined;
      }
    }
  }
  return [...records.values()].sort((a, b) => b.ts.localeCompare(a.ts));
}

export async function getSubmission(id: string) {
  return (await listSubmissions()).find((item) => item.id === id);
}

async function withLock(action: () => Promise<void>) {
  const handle = await open(LOCK, "wx", 0o600).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") throw new Error("Another review update is in progress");
    throw error;
  });
  try { await action(); } finally {
    await handle.close();
    await unlink(LOCK).catch(() => undefined);
  }
}

export async function appendReview(id: string, status: ReviewStatus, actor: string, note?: string, outcome?: ReviewOutcome) {
  await withLock(async () => {
    const record = await getSubmission(id);
    if (!record) throw new Error("Submission not found");
    await appendFile(QUEUE, `${JSON.stringify({
      type: "review", id, ts: new Date().toISOString(), status,
      revision: record.revision + 1, actor, ...(note ? { note } : {}), ...(outcome ? { outcome } : {}),
    })}\n`, { encoding: "utf8", mode: 0o600 });
  });
}

export async function appendReply(id: string, status: "sent" | "failed", actor: string, providerId?: string, reason?: string) {
  await appendFile(QUEUE, `${JSON.stringify({
    type: "reply", id, ts: new Date().toISOString(), status, actor,
    ...(providerId ? { providerId } : {}), ...(reason ? { reason } : {}),
  })}\n`, { encoding: "utf8", mode: 0o600 });
}

export function submissionImagePath(relativeFile: string) {
  if (!relativeFile || isAbsolute(relativeFile) || normalize(relativeFile).startsWith("..")) throw new Error("Invalid image path");
  const root = resolve(/* turbopackIgnore: true */ SUBMISSIONS_DIR);
  const path = resolve(root, relativeFile);
  if (!path.startsWith(`${root}${sep}`)) throw new Error("Invalid image path");
  return path;
}
