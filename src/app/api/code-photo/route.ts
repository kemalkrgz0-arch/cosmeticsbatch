import { randomUUID } from "node:crypto";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { isRealApiUser } from "@/lib/bot-filter";
import { sendSubmissionEmail } from "@/lib/submission-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A fixed external development fallback avoids tracing the entire project
// directory; production supplies the bind-mounted SUBMISSIONS_DIR.
const DIR = process.env.SUBMISSIONS_DIR || "/tmp/cosmeticsbatch-submissions";
const MAX_BODY_BYTES = 16 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 3;
const LIMIT_WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const buckets = new Map<string, { count: number; resetAt: number }>();

const TYPES: Record<string, { ext: string; signature: (b: Uint8Array) => boolean }> = {
  "image/jpeg": { ext: "jpg", signature: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", signature: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/webp": { ext: "webp", signature: (b) => new TextDecoder().decode(b.slice(0, 4)) === "RIFF" && new TextDecoder().decode(b.slice(8, 12)) === "WEBP" },
};

function clientKey(req: NextRequest) {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function allowed(key: string) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + LIMIT_WINDOW_MS };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= LIMIT;
}

function json(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const referer = req.headers.get("referer");
  if (!isRealApiUser({
    ua: req.headers.get("user-agent"),
    secFetchSite: req.headers.get("sec-fetch-site"),
    referer,
    host: req.headers.get("host"),
  })) return json("same-origin browser request required", 403);

  if (!allowed(clientKey(req))) return json("too many submissions", 429);
  const length = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) return json("image is too large", 413);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json("invalid form data", 400);
  }

  const slug = String(form.get("slug") ?? "").trim();
  const code = String(form.get("code") ?? "").trim().slice(0, 64);
  const note = String(form.get("note") ?? "").trim().slice(0, 500);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const consent = form.get("consent") === "true";
  const images = form.getAll("image");
  const brand = getBrand(slug);
  if (!brand) return json("unknown brand", 404);
  if (!EMAIL.test(email)) return json("valid email is required", 400);
  if (!consent) return json("consent is required", 400);
  if (images.length === 0 || images.length > MAX_IMAGES || images.some((image) => !(image instanceof File) || image.size === 0)) return json("between 1 and 3 images are required", 400);

  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
  const monthDir = join(
    /* turbopackIgnore: true */ DIR,
    new Date().toISOString().slice(0, 7),
  );
  await mkdir(monthDir, { recursive: true });
  const stored = [];
  for (const [index, value] of images.entries()) {
    const image = value as File;
    if (image.size > MAX_IMAGE_BYTES) return json("image is too large", 413);
    const type = TYPES[image.type];
    if (!type) return json("unsupported image type", 415);
    const bytes = new Uint8Array(await image.arrayBuffer());
    if (!type.signature(bytes)) return json("invalid image data", 415);
    stored.push({
      relativeFile: `${new Date().toISOString().slice(0, 7)}/${id}-${index + 1}.${type.ext}`,
      imageType: image.type,
      bytes,
    });
  }
  for (const image of stored) await writeFile(join(/* turbopackIgnore: true */ DIR, image.relativeFile), image.bytes, { flag: "wx", mode: 0o600 });
  const relativeFiles = stored.map((image) => image.relativeFile);
  const queueFile = join(/* turbopackIgnore: true */ DIR, "submissions.jsonl");
  await appendFile(queueFile, JSON.stringify({
    type: "submission",
    id,
    ts: new Date().toISOString(),
    brand: brand.slug,
    code,
    note,
    email,
    file: relativeFiles[0],
    files: relativeFiles,
    status: "pending",
  }) + "\n", { encoding: "utf8", mode: 0o600 });

  const notification = await sendSubmissionEmail({
    id,
    brandName: brand.name,
    brandSlug: brand.slug,
    code,
    note,
    userEmail: email,
    images: stored.map((image) => ({ filename: image.relativeFile, imageType: image.imageType, imageBytes: image.bytes })),
  });
  await appendFile(queueFile, JSON.stringify({
    type: "notification",
    id,
    ts: new Date().toISOString(),
    channel: "email",
    ...notification,
  }) + "\n", { encoding: "utf8", mode: 0o600 });
  if (notification.status === "failed") console.warn("Submission email failed", { id, reason: notification.reason });

  return NextResponse.json({ ok: true, id, notification: notification.status }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
