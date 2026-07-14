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
  beiersdorf: {
    decoderId: "beiersdorf", version: "1.0.0", verificationStatus: "UNKNOWN",
    datePrecision: "day", sourceType: "observed-samples", sourceReferences: [], verifiedAt: null,
    supportedCodeFormats: ["YWW followed by production digits"],
    knownLimitations: ["Date represents the start of a production week", "Single-digit year repeats every decade", "Primary evidence needs verification"],
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
