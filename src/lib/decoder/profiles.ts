import type { DecoderProfile } from "./types";

/**
 * Evidence registry for every runtime decoder.
 *
 * Conservative rule: no primary/reference URL in this repository means no
 * VERIFIED/HIGH_CONFIDENCE label, regardless of how plausible the current
 * implementation or its comments appear. Adding a source must be an editorial
 * review, not a code-only change.
 */
export const DECODER_PROFILES: Record<string, DecoderProfile> = {
  "estee-lauder": {
    decoderId: "estee-lauder", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "month", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["3–4 chars; trailing month character + year digit"],
    knownLimitations: ["Single-digit year repeats every decade", "Day is estimated as mid-month", "Primary evidence needs verification"],
  },
  loreal: {
    decoderId: "loreal", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "month", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["factory prefix + year letter + month character + batch series"],
    knownLimitations: ["Letter-cycle provenance needs verification", "Day is estimated as mid-month"],
  },
  coty: {
    decoderId: "coty", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD"],
    knownLimitations: ["Single-digit year repeats every decade", "Primary evidence needs verification"],
  },
  chanel: {
    decoderId: "chanel", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "variable", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD", "YYDDD", "YYMMDD"],
    knownLimitations: ["No confirmed public manufacturer scheme", "Numeric codes can have multiple interpretations"],
  },
  dior: {
    decoderId: "dior", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "variable", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD", "YYDDD", "YYMMDD"],
    knownLimitations: ["No primary source stored", "Numeric codes can have multiple interpretations"],
  },
  acquadiparma: {
    decoderId: "acquadiparma", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["DDDY with plant letter"],
    knownLimitations: ["Single-digit year repeats every decade", "Day-of-year > 366 or non-conforming codes do not decode"],
  },
  julian: {
    decoderId: "julian", version: "1.0.0", verificationStatus: "FORMAT_ONLY",
    datePrecision: "variable", sourceType: "documented-industry", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YYDDD", "DDDYY", "YYMMDD", "DDMMYY"],
    knownLimitations: ["Not manufacturer evidence", "Multiple interpretations may be valid", "Disabled as an automatic cross-brand fallback"],
  },
  creed: {
    decoderId: "creed", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "year", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["first letter year cycle"],
    knownLimitations: ["Month/day are not encoded", "Letter-cycle provenance needs verification"],
  },
  interparfums: {
    decoderId: "interparfums", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["first letter year + trailing DDD"],
    knownLimitations: ["Trailing digits may be a factory line", "Primary evidence needs verification"],
  },
  embedded: {
    decoderId: "embedded", version: "1.0.0", verificationStatus: "FORMAT_ONLY",
    datePrecision: "variable", sourceType: "documented-industry", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD", "YYDDD", "YYMMDD"],
    knownLimitations: ["Format recognition is not manufacturer verification", "Numeric codes can have multiple interpretations"],
  },
  "jean-paul-gaultier": {
    decoderId: "jean-paul-gaultier", version: "1.0.0", verificationStatus: "FORMAT_ONLY",
    datePrecision: "variable", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD", "YYDDD", "YYMMDD", "LLLDDL (recognised, not dated)"],
    knownLimitations: [
      "Only the Puig-era numeric code yields a date",
      "The Beauté Prestige International alphanumeric code is recognised but deliberately left undated",
      "Primary evidence needs verification",
    ],
  },
  beiersdorf: {
    decoderId: "beiersdorf", version: "1.1.0", verificationStatus: "ESTIMATED",
    datePrecision: "day", sourceType: "observed-samples",
    // Not VERIFIED, deliberately, and the header rule above is why: three
    // Eucerin cartons photographed on 2026-07-20 each carried the batch code
    // above a printed expiry — 43844057 / EXP 08-2026, 51341357 / EXP 03-2027,
    // 51826188 / EXP 05-2028 — and the year-digit-plus-week reading places all
    // three sensibly ahead of their dates. That is the strongest evidence any
    // decoder here has, but the photographs live in a chat session rather than
    // in this repository, so a later reader cannot check the claim. Promoting
    // this needs the images stored and an editorial review, not a code edit.
    // See findings 39 and 40.
    sourceReferences: [],
    verifiedAt: null,
    supportedCodeFormats: ["YWW followed by production digits, 6-8 digits, optional two trailing letters"],
    knownLimitations: [
      "Date represents the start of a production week",
      "Single-digit year repeats every decade",
      "Shelf life varies by product: observed 23, 24 and 37 months against a 36-month brand constant",
    ],
  },
  naos: {
    decoderId: "naos", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["DDDY with optional suffix"],
    knownLimitations: ["Single-digit year repeats every decade", "Printed expiry should take precedence", "Primary evidence needs verification"],
  },
  deciem: {
    decoderId: "deciem", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "month", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["year digit + month letter A–L + production digits"],
    knownLimitations: ["Older regional codes are unsupported", "Trailing digits are not treated as a day", "Primary evidence needs verification"],
  },
  shiseido: {
    decoderId: "shiseido", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD with optional plant suffix"],
    knownLimitations: ["Single-digit year repeats every decade", "Primary evidence needs verification"],
  },
  pg: {
    decoderId: "pg", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "documented-industry", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD", "YYDDD", "YYYYDDD"],
    knownLimitations: ["Short formats have decade/century ambiguity", "A primary reference must be stored before verification"],
  },
  kbeauty: {
    decoderId: "kbeauty", version: "1.0.0", verificationStatus: "FORMAT_ONLY",
    datePrecision: "variable", sourceType: "regulator", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YYYYMMDD", "YYMMDD", "YYMM"],
    knownLimitations: ["A printed date is not necessarily a batch-code format", "Brand-level applicability needs verification", "YYMM is month precision"],
  },
  rohto: {
    decoderId: "rohto", version: "1.0.0", verificationStatus: "ESTIMATED",
    datePrecision: "month", sourceType: "community", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["year digit + month letter A–L + line"],
    knownLimitations: ["Community-observed and unconfirmed", "Single-digit year repeats every decade", "Day is not encoded"],
  },
  kenvue: {
    decoderId: "kenvue", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "documented-industry", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["DDDYY", "DDDY"],
    knownLimitations: ["Short format repeats every decade", "Primary evidence needs verification"],
  },
  unilever: {
    decoderId: "unilever", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YDDD with optional plant suffix"],
    knownLimitations: ["Some plants use an unsupported variant", "Single-digit year repeats every decade", "Primary evidence needs verification"],
  },
};

export function getDecoderProfile(id: string | undefined): DecoderProfile | undefined {
  return id ? DECODER_PROFILES[id] : undefined;
}
