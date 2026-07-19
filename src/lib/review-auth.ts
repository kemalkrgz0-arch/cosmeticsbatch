import { createPublicKey, verify, type JsonWebKey } from "node:crypto";
import { headers } from "next/headers";

type AccessPayload = {
  aud?: string | string[];
  email?: string;
  exp?: number;
  nbf?: number;
  iss?: string;
  type?: string;
};

type Jwk = JsonWebKey & { kid?: string };
type Jwks = { keys?: Jwk[] };

let cachedKeys: { expiresAt: number; keys: Jwk[] } | undefined;

/**
 * Decode one base64url JWT segment.
 *
 * A malformed segment is an invalid token, not an internal fault: letting
 * `JSON.parse` throw raised a bare `SyntaxError: Unexpected end of JSON input`
 * from inside the auth path, which reads like a bug in the app rather than a
 * refused credential. Access is denied either way; this only keeps the failure
 * in the same vocabulary as every other rejection here.
 */
export function decodeAccessPart<T extends object>(value: string): T {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    throw new Error("Invalid Access token");
  }
  if (typeof decoded !== "object" || decoded === null || Array.isArray(decoded)) {
    throw new Error("Invalid Access token");
  }
  return decoded as T;
}

function config() {
  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN?.replace(/\/$/, "");
  const audience = process.env.CF_ACCESS_AUD;
  const reviewers = new Set(
    (process.env.REVIEWER_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!teamDomain || !audience || reviewers.size === 0) {
    throw new Error("Review authentication is not configured");
  }
  return { teamDomain, audience, reviewers };
}

async function signingKeys(teamDomain: string) {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  const response = await fetch(`${teamDomain}/cdn-cgi/access/certs`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error("Unable to load Access signing keys");
  const body = await response.json() as Jwks;
  if (!body.keys?.length) throw new Error("Access signing keys are empty");
  cachedKeys = { keys: body.keys, expiresAt: Date.now() + 60 * 60 * 1000 };
  return body.keys;
}

export async function verifyAccessToken(token: string) {
  const { teamDomain, audience, reviewers } = config();
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid Access token");
  const header = decodeAccessPart<{ alg?: string; kid?: string }>(parts[0]);
  const payload = decodeAccessPart<AccessPayload>(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported Access token");

  const key = (await signingKeys(teamDomain)).find((candidate) => candidate.kid === header.kid);
  if (!key) {
    cachedKeys = undefined;
    throw new Error("Unknown Access signing key");
  }
  const signatureValid = verify(
    "RSA-SHA256",
    Buffer.from(`${parts[0]}.${parts[1]}`),
    createPublicKey({ key, format: "jwk" }),
    Buffer.from(parts[2], "base64url"),
  );
  if (!signatureValid) throw new Error("Invalid Access signature");

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  const email = payload.email?.toLowerCase();
  if (payload.iss !== teamDomain || payload.type !== "app") throw new Error("Invalid Access issuer");
  if (!audiences.includes(audience)) throw new Error("Invalid Access audience");
  if (!payload.exp || payload.exp <= now || (payload.nbf && payload.nbf > now + 30)) throw new Error("Expired Access token");
  if (!email || !reviewers.has(email)) throw new Error("Reviewer is not allowed");
  return { email };
}

export async function requireReviewer() {
  const requestHeaders = await headers();
  const token = requestHeaders.get("cf-access-jwt-assertion");
  if (!token) throw new Error("Cloudflare Access token is missing");
  return verifyAccessToken(token);
}
